import { auth, addDoc, collection, db, serverTimestamp, runTransaction, doc, setDoc, updateDoc, getDoc, query, onSnapshot, deleteDoc, firestore, getDocs } from './Config';



// saveUserBalance funktio, jonka ainoa muutos on turhien määrittelyjen poistaminen
const saveUserBalance = async (userId, amount, onSuccess, onError) => {
  const balanceDocRef = doc(db, "Users", userId, "Balances", "current");

  try {
    await setDoc(balanceDocRef, {
      Amount: parseFloat(amount),
      Timestamp: serverTimestamp()
    }, { merge: true }); // Merge true varmistaa, että olemassa olevat kentät päivitetään

    onSuccess();
  } catch (error) {
    console.error("Error saving balance: ", error);
    onError(error);
  }
};
// saveUserSavingsGoal funktio, joka lisää uuden collectionin "SavingsGoal" käyttäjän tietokantaan
const saveUserSavingsGoal = async (userId, savingsgoalData, onSuccess, onError) => {
  try {
    // Luodaan viite 'SavingsGoal'-alikokoelmaan
    const savingsGoalRef = collection(db, "Users", userId, "SavingsGoal");

    // Lisätään uusi dokumentti 'SavingsGoal'-alikokoelmaan
    const docRef = await addDoc(savingsGoalRef, {
      ...savingsgoalData,
      Timestamp: serverTimestamp(),
    });

    onSuccess(docRef.id); // Palautetaan luodun dokumentin ID onnistumisen yhteydessä
  } catch (error) {
    console.error("Error saving savings goal: ", error);
    onError(error);
  }
};

const saveCurrencySymbol = async (userId, symbol, onSuccess, onError) => {
  const currencyDocRef = doc(db, "Users", userId, "Balances", "current");

  try {
    await setDoc(currencyDocRef, {
      Symbol: String(symbol),
    }, { merge: true }); // Merge true varmistaa, että olemassa olevat kentät päivitetään

    onSuccess();
  } catch (error) {
    console.error("Error saving symbol: ", error);
    onError(error);
  }
};

const updateCurrencySymbol = async (userId, symbol, onSuccess, onError) => {
  const currencyDocRef = doc(db, "Users", userId, "Balances", "current");

  try {
    await updateDoc(currencyDocRef, {
      Symbol: String(symbol)  // Only updates the Symbol field
    });

    onSuccess("Symbol updated successfully"); // Call the success callback with a message
  } catch (error) {
    console.error("Error updating currency symbol: ", error);
    onError(error);  // Call the error callback
  }
};

const fetchCurrencySymbol = async (userId, onSuccess, onError) => {
  try {
    const currencyDocRef = doc(db, "Users", userId, "Balances", "current");
    const currencyDocSnap = await getDoc(currencyDocRef); // Haetaan asiakirjan tiedot
    if (currencyDocSnap.exists()) {
      const currencyData = currencyDocSnap.data(); // Haetaan dokumentin data
      const symbol = currencyData.Symbol; // Haetaan valuuttasymboli
      return symbol;
    } else {
      throw new Error("Currency document not found");
    }
  } catch (error) {
    console.error("Error fetching symbol: ", error);
    throw error;
  }
};

const handleCurrencySymbolChange = (userId, onUpdate) => {
  const currencyDocRef = doc(db, "Users", userId, "Balances", "current");
  const unsubscribe = onSnapshot(currencyDocRef, (doc) => {
    if (doc.exists()) {
      const currencyData = doc.data();
      const symbol = currencyData.Symbol;
      onUpdate(symbol);
    } else {
      console.error("Currency document not found");
    }
  });
  return unsubscribe;
};


const saveUserTransaction = async (userId, transactionData, onSuccess, onError) => {
  try {
    const transactionRef = collection(db, "Users", userId, "Transactions");
    await addDoc(transactionRef, {
      ...transactionData,
    });
    onSuccess(); // Kutsutaan onnistumisen callback, jos se on määritelty
  } catch (error) {
    console.error("Error adding transaction: ", error);
    onError(error); // Kutsutaan virheenkäsittelyn callback, jos se on määritelty
  }
};

const saveUserTransactionAndUpdateBalance = async (userId, transactionData, onSuccess, onError) => {
  const userBalanceRef = doc(db, "Users", userId, "Balances", "current"); // Oletetaan, että "current" on pysyvä saldo-dokumentti
  const userTransactionsRef = collection(db, "Users", userId, "Transactions");

  try {
    await runTransaction(db, async (transaction) => {
      const userBalanceDoc = await transaction.get(userBalanceRef);

      // Jos saldo-dokumenttia ei ole, luodaan se
      if (!userBalanceDoc.exists()) {
        transaction.set(userBalanceRef, {
          Amount: transactionData.isExpense ? -transactionData.amount : transactionData.amount,
          Timestamp: serverTimestamp(),
        });
      } else {
        // Jos saldo-dokumentti on olemassa, päivitetään saldoa
        const newBalance = userBalanceDoc.data().Amount + (transactionData.isExpense ? -transactionData.amount : transactionData.amount);
        transaction.update(userBalanceRef, {
          Amount: newBalance,
          Timestamp: serverTimestamp(),
        });
      }

      // Lisätään uusi transaktio
      await addDoc(userTransactionsRef, {
        ...transactionData,
        Timestamp: serverTimestamp(),
      });
    });

    onSuccess("Transaction and balance updated successfully.");
  } catch (error) {
    console.error("Error updating balance: ", error);
    onError("Failed to update transaction and balance.");
  }
};

const getCurrentUserId = () => {
  return auth.currentUser ? auth.currentUser.uid : null;
};

const fetchSavingsGoals = async (userId, setMarkedDates, setSelectedGoals) => {
  const q = query(collection(db, "Users", userId, "SavingsGoal"));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const goals = {};
    const markedDates = {};

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const dateStr = data.date.toDate().toISOString().split('T')[0];

      if (!markedDates[dateStr]) {
        markedDates[dateStr] = { marked: true, dots: [] };
        goals[dateStr] = []; // Alustetaan tyhjänä, jos ei ole vielä olemassa
      }

      markedDates[dateStr].dots.push({ key: doc.id, color: 'red' });
      // Lisää myös amount ja plan tiedot listaan
      goals[dateStr].push({ plan: data.plan, amount: data.amount, date: data.date.toDate() });
    });


    setMarkedDates(markedDates); // Päivitä tila merkityille päivämäärille
    setSelectedGoals(goals); // Päivitä tila valittujen päivämäärien `SavingsGoal`-tiedoille
  });

  return unsubscribe; // Tämän pitäisi olla funktio.
};

const fetchSavingsGoalsForShow = async (userId, setSavingsPlans) => {
  try {
    const q = query(collection(db, "Users", userId, "SavingsGoal"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const plans = [];
      querySnapshot.forEach((doc) => {
          const data = doc.data();
          plans.push({ id: doc.id, plan: data.plan, amount: data.amount, date: data.date.toDate(), userId: userId });
      });
      setSavingsPlans(plans);
  });

  return unsubscribe;
  } catch (error) {
    console.error("Error fetching savings goals:", error);
    // Käsittele virhe esimerkiksi palauttamalla tyhjä funktio
    return () => {};
  }
};

const saveCategories = async (userId, categories) => {
  const userRef = doc(db, "Users", userId);
  await setDoc(userRef, { categories: categories }, { merge: true });
};

const loadCategories = async (userId) => {
  const userRef = doc(db, "Users", userId);
  const docSnap = await getDoc(userRef);
  if (docSnap.exists()) {
    return docSnap.data().categories;
  } else {
    // Dokumenttia ei löytynyt
    console.log("No such document!");
    return [];
  }
};

const deleteTransaction = async (userId, transactionId) => {
  try {
    await deleteDoc(doc(db, "Users", userId, "Transactions", transactionId));
    console.log("Transaction deleted successfully.");
  } catch (error) {
    console.error("Error deleting transaction:", error);
  }
};

const updateTransaction = async (userId, transactionId, newData) => {
  try {
    const transactionRef = doc(db, "Users", userId, "Transactions", transactionId);
    await updateDoc(transactionRef, newData);
    console.log("Transaction updated successfully.");
  } catch (error) {
    console.error("Error updating transaction:", error);
  }
};

const handleSaveCustomAmount = async (
  selectedPlan,
  customSavingsAmount,
  setCustomSavingsAmount,
  setMonthlySavingsNeeded,
  monthlySavingsNeeded,
  setSavedAmount,
  setSelectedPlan,
  isSavedAmountUpdated,
  setIsSavedAmountUpdated
) => {

  // Tarkista, että selectedPlan on määritelty ja loggaa se tarvittaessa
  if (!selectedPlan || !selectedPlan.userId) {
    console.log("No selectedPlan or missing userId.");
    alert("No plan selected or user ID is missing.");
    return;
  }

  try {
    // Lasketaan uusi tallennettu summa lisäämällä vanha summa ja uusi custom summa
    const newSavedAmount = parseFloat(customSavingsAmount);

    // Päivitetään tietokantaan tallennettu summa
    await updateSavedAmount(selectedPlan.userId, selectedPlan.id, newSavedAmount);

    // Päivitetään tilaa uudella tallennetulla summalla
    setSavedAmount(newSavedAmount);

    // Päivitetään valittu suunnitelma uudella tallennetulla summalla
    const updatedSelectedPlan = { ...selectedPlan, savedAmount: newSavedAmount };
    setSelectedPlan(updatedSelectedPlan);

    // Aseta tila osoittamaan, että tallennettu summa on päivitetty
    if (setIsSavedAmountUpdated) {
      setIsSavedAmountUpdated(true);
    }

    // Alert käyttäjälle onnistuneesta tallennuksesta
    alert("Custom savings added successfully.");

    // Tyhjennetään mukautetun säästösumman syöte
    setCustomSavingsAmount('');
  } catch (error) {
    // Käsitellään virhe
    console.error("Error in handleSaveCustomAmount:", error);
    alert("An unexpected error occurred.");
  } finally {
  }
};


const updateSavedAmount = async (userId, savingsGoalId, newSavedAmount) => {
  const userRef = doc(db, "Users", userId, "SavingsGoal", savingsGoalId);

  try {
    const docSnapshot = await getDoc(userRef);
    if (docSnapshot.exists()) {
      const currentSavedAmount = docSnapshot.data().savedAmount || 0;
      const updatedSavedAmount = currentSavedAmount + newSavedAmount;

      await updateDoc(userRef, {
        savedAmount: updatedSavedAmount
      });
      console.log("Saved amount updated successfully.");
    } else {
      console.log("No such document!");
    }
  } catch (error) {
    console.error("Error updating saved amount: ", error);
  }
};

const setSavedAmountState = (newSavedAmount) => {
  setSelectedPlan((prevPlan) => ({
    ...prevPlan,
    savedAmount: newSavedAmount,
  }));
};


const fetchSavedAmountFromDB = async (userId, savingsGoalId) => {
  try {
    const docRef = doc(db, "Users", userId, "SavingsGoal", savingsGoalId);
    const docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) {
      const data = docSnapshot.data();
      return data.savedAmount || 0;
    } else {
      console.log("No such document!");
      return 0;
    }
  } catch (error) {
    console.error("Error fetching saved amount from database: ", error);
    return 0;
  }
};

const deleteSavingsPlanDB = async (savingsPlanId) => {
  const userId = getCurrentUserId();
  if (!userId) {
    console.log("User ID is missing");
    return;
  }
  try {
    await deleteDoc(doc(db, "Users", userId, "SavingsGoal", savingsPlanId));
    console.log("Savings plan deleted successfully.");
  } catch (error) {
    console.error("Error deleting savings plan:", error);
    throw error;  // Heitä virhe eteenpäin käsiteltäväksi
  }
};


const getUserData = async (userId) => {
  try {
    const docRef = doc(db, "Users", userId);
    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists()) {
      const userData = docSnapshot.data();
      return userData; // Return the entire data object if needed
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user info: ", error);
    throw error;
  }
};

const updateUserName = async (userId, name) => {
  const userDocRef = doc(db, "Users", userId);
  return updateDoc(userDocRef, { name: name });
};


const saveImageUriToDatabase = async (userId, imageUrl) => {
  try {

    const userDocRef = doc(db, "Users", userId);
    const userDocSnapshot = await getDoc(userDocRef);

    if (userDocSnapshot.exists()) {
      const userData = userDocSnapshot.data();

      if (!userData.hasOwnProperty("imageUrl")) {
        await updateDoc(userDocRef, { imageUrl: imageUrl });
      } else {
        await updateDoc(userDocRef, { imageUrl: imageUrl });
      }

      console.log("Image URL saved to database successfully");
    } else {
      throw new Error("User data not found");
    }
  } catch (error) {
    console.error("Error saving image URL to database:", error);
    throw error;
  }
};

const fetchUserTransactions = async (userId) => {
  const userTransactionsRef = collection(db, "Users", userId, "Transactions");

  try {
    const querySnapshot = await getDocs(userTransactionsRef);
    
    const transactions = [];
    querySnapshot.forEach((doc) => {
      transactions.push({ id: doc.id, ...doc.data() });
    });

    return transactions;
  } catch (error) {
    console.error("Error fetching user transactions:", error);
    throw error;
  }
};


export {
  saveUserBalance,
  saveUserTransaction,
  saveUserTransactionAndUpdateBalance,
  getCurrentUserId,
  saveCurrencySymbol,
  fetchSavingsGoals,
  fetchSavingsGoalsForShow,
  saveCategories,
  loadCategories,
  saveUserSavingsGoal,
  deleteTransaction,
  updateTransaction,
  fetchCurrencySymbol,
  handleSaveCustomAmount,
  updateSavedAmount,
  setSavedAmountState,
  fetchSavedAmountFromDB,
  deleteSavingsPlanDB,
  getUserData,
  updateUserName,
  saveImageUriToDatabase,
  updateCurrencySymbol,
  handleCurrencySymbolChange,
  fetchUserTransactions,


};