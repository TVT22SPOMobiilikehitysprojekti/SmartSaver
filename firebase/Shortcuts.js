import { auth, addDoc, collection, db, serverTimestamp, runTransaction, doc, setDoc, updateDoc, getDoc, query, onSnapshot, deleteDoc } from './Config';


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
    const currencyDocRef = doc(db, "Users", userId, "Balances", "current");
  
    try {
      const currencyDocSnap = await getDoc(currencyDocRef); // Haetaan asiakirjan tiedot
      if (currencyDocSnap.exists()) {
        const currencyData = currencyDocSnap.data(); // Haetaan dokumentin data
        const symbol = currencyData.Symbol; // Haetaan valuuttasymboli
        onSuccess(symbol); // Lähetetään valuuttasymboli onnistumistapauksessa
      } else {
        // Dokumenttia ei löydetty
        onError("Currency document not found");
      }
    } catch (error) {
      console.error("Error fetching symbol: ", error);
      onError(error);
    }
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
  const q = query(collection(db, "Users", userId, "SavingsGoal"));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const plans = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Lisätään tiedot listaan
      plans.push({ id: doc.id, plan: data.plan, amount: data.amount, date: data.date.toDate() });
    });

    // Päivitä tila suunnitelmille
    setSavingsPlans(plans);
  });

  return unsubscribe;
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
    updateCurrencySymbol,
  
};