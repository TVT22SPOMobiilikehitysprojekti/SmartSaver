import { auth, addDoc, collection, db, serverTimestamp, runTransaction, doc, setDoc, updateDoc, getDoc, query, onSnapshot } from './Config';


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

  const saveCurrencySymbol = async (userId, symbol, onSuccess, onError) => {
    const currencyDocRef = doc(db, "Users", userId, "Currency", "symbol");
  
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

  
  export { 
    saveUserBalance,
    saveUserTransaction,
    saveUserTransactionAndUpdateBalance,
    getCurrentUserId,
 CurrencyPicker
    saveCurrencySymbol

    fetchSavingsGoals,
    fetchSavingsGoalsForShow,
    saveCategories,
    loadCategories,
main

};