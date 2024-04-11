import { auth, addDoc, collection, db, serverTimestamp, runTransaction, doc, setDoc } from './Config';


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
const saveUserSavingsGoal = async (userId, savingsgoalData,onSuccess, onError) => {
  const SavingsGoalDocRef = doc(db, "Users", userId, "SavingsGoal");

  try {
    await addDoc(SavingsGoalDocRef, {
      ...savingsgoalData,
    }, { merge: true }); // Merge true varmistaa, että olemassa olevat kentät päivitetään

    onSuccess();
  } catch (error) {
    console.error("Error saving Goal: ", error);
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


  
  export { 
    saveUserBalance,
    saveUserTransaction,
    saveUserTransactionAndUpdateBalance,
    getCurrentUserId,
    saveUserSavingsGoal


};