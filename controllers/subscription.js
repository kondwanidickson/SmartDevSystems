const asyncHandler = require("express-async-handler");
const { addDoc, getDoc, getDocs, updateDoc } = require('firebase/firestore');
const { Subscriptions, docRef } = require('../config/firebase.js');

const new_subscription = asyncHandler( async(req, res) => {
    try {
        const { uid, name, subscriptionType } = req.body
        // console.log({ uid, name, subscriptionType })

        if (!uid || !name || !subscriptionType) {
          res.status(400).json({ type: 'error', message: 'Input fields are invalid' })
          return
        }

        await addDoc(Subscriptions, { uid, name, subscriptionType, created: new Date() }).then(()=>{
          res.status(200).json({ type: 'success', message: 'New subscription added successfully' })
        }).catch((error)=>{
          // console.log(error)
          res.status(200).json({ type: 'error', message: 'Failed to add new subscription' })
        })
    } catch (error) {
        console.error(error)
    }
})

const update_subscription = asyncHandler( async(req, res) => {
  try {
      const { id, subscriptionType } = req.body
      // console.log({ id, subscriptionType })

      if (!id || !subscriptionType) {
        res.status(400).json({ type: 'error', message: 'Input fields are invalid' })
        return
      }

      const subscription = await getDoc(docRef('subscriptions', id))

      if (subscription.exists()) {
        await updateDoc(docRef('subscriptions', id), { subscriptionType }).then(()=>{
          res.status(200).json({ type: 'success', message: 'Subscription updated successfully' })
        }).catch((error)=>{
          // console.log(error)
          res.status(200).json({ type: 'error', message: 'Failed to add update subscription' })
        })

        return
      }

      res.status(200).json({ type: 'error', message: 'Failed to add update subscription' })
      
  } catch (error) {
      console.error(error)
  }
})

const get_subscriptions = asyncHandler( async (parent, args) => {
    const { uid, name, subscriptionType } = args;
    // console.log({ title, budget, duration, description });

    let query = await getDocs(Subscriptions);

    if (uid && uid !== "") {
      query = query.docs.filter(doc => doc.data().uid.match(new RegExp(uid, "i")));
    }

    if (name && name !== "") {
      query = query.docs.filter(doc => doc.data().name.match(new RegExp(name, "i")));
    }

    if (subscriptionType && subscriptionType !== "") {
      query = query.docs.filter(doc => doc.data().subscriptionType.match(new RegExp(subscriptionType, "i")));
    }

    const data = query.docs ? query.docs : query

    return data.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
})

module.exports = {
    new_subscription,
    get_subscriptions,
    update_subscription
}