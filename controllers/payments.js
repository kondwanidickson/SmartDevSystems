const asyncHandler = require("express-async-handler");
const { addDoc, deleteDoc, getDoc, getDocs, updateDoc } = require('firebase/firestore');
const { docRef, Payments, fileRef, uploadBytes, getDownloadURL } = require('../config/firebase.js');
const nodemailer = require('nodemailer')

const new_payment = asyncHandler( async(req, res) => {
    try {
      const { body: { uid, myService, provider, transid, amount, fullname, date }, file } = req
      // console.log({uid, provider, transid, fullname, date})

      if (!uid || !myService || !provider || !transid || !amount || !fullname || !date) {
        res.status(400).json({ type: 'error', message: 'Input fields are invalid' })
        return
      }

      if (file) {
        uploadBytes(fileRef("payments/" + transid), file.buffer).then(async (_) => {
          // res.status(200).json({ type: 'success', message: 'Payment proof added successfully' })
          
          await addDoc(Payments, { uid, my_service: JSON.parse(myService), provider, transid, amount, fullname, date, status: false }).then(()=>{
            res.status(200).json({ type: 'success', message: 'New payment added successfully' })
          }).catch((error)=>{
            console.log(error)
            res.status(200).json({ type: 'error', message: 'Failed to add new payment' })
          })
        }).catch((error)=>{
          console.log(error)
          res.status(200).json({ type: 'error', message: 'Failed to add new payment' })
        })
        return
      }

      res.status(200).json({ type: 'error', message: 'Failed to add new payment' })
    } catch (error) {
      console.error(error)
    }
})

const update_payment_api = asyncHandler( async(req, res) => {
    try {
      const { body: { id, myService, provider, transid, amount, fullname, date }, file } = req

      if (!id || !myService || !provider || !transid || !amount || !fullname || !date) {
        res.status(400).json({ type: 'error', message: 'Input fields are invalid' })
        return
      }

      await updateDoc(docRef("payments", id), { myService, provider, transid, amount, fullname, date }).then(async _ => {
        let doc = await getDoc(docRef("payments", id))
  
        if (!doc.exists()) {
          res.status(400).json({ type: 'success', message: 'Payment update failed' })
          return
        }
  
        res.status(200).json({ type: 'success', message: 'Payment updated successfully' })
      }).catch((error) => {
        res.status(400).json({ type: 'success', message: 'Payment update failed' })
        console.error(error)
        return
      })

    } catch (error) {
      console.error(error)
      return null
    }
})

const update_payment = asyncHandler( async(_, args, context) => {
    try {
      const { id, _status } = args

      if (!id || (_status === null || _status === undefined)) {
        return null
      }

      await updateDoc(docRef("payments", id), { _status }).then(async _ => {
        let doc = await getDoc(docRef("payments", id))
  
        if (!doc.exists()) return null

        let transporter = nodemailer.createTransport({
            host: 'smtp.titan.email',
            port: 587,
            secure: false,
            auth: {
                user: process.env.MAIN_SALES,
                pass: process.env.MAIN_SALES_PASS,
            },
        });

        if (_status === false) {
          const uid = doc.data().uid
          const user = await getDoc(docRef("users", uid))

          if (user && user.exists()) {
            var mailOptions = {
              from: `SDS PRODUCT VERIFICATION <sales@smartdevsystems.com>`,
              to: user.data().email,
              subject: 'Service Payment Verification Required',
              text: `Dear ${doc.data().fullname},\n\nWe have received your payment for the service ${doc.data().my_service.name}, but it has not been verified yet because of mistakes in your payment proof. To complete the verification process, please review send us your payment proof again.\n\nService: ${doc.data().my_service.name}\n\nThank you for your cooperation.\n\nSincerely,\nSmartDevSystems`
            };
            
            transporter.sendMail(mailOptions, function(error, info){
              if (error) {
                console.log({ type:'error', message: 'Mail sending failed' })
              }
      
              if(info){
                console.log({ type:'success', message: 'Mail was sent successfully' })
              }
            });
          }
        }

        if (_status === true) {
          const uid = doc.data().uid
          const user = await getDoc(docRef("users", uid))

          if (user && user.exists()) {
            var mailOptions = {
              from: `SDS PRODUCT VERIFICATION <sales@smartdevsystems.com>`,
              to: user.data().email,
              subject: 'Payment Verification Successful',
              text: `Dear ${doc.data().fullname},\n\nWe are pleased to inform you that your payment for thservichas been successfully verified. Your order for ${doc.data().my_service.name} has beeprocessed anis now confirmed.\n\nService: ${doc.data().my_service.name}\n\nIf you have anfurther questions oneed assistance, please feel free to contact us.\n\nThank you for choosinSmartDevSystem\n\nSincerely,\nSmartDevSystems`
            };
            
            transporter.sendMail(mailOptions, function(error, info){
              if (error) {
                console.log({ type:'error', message: 'Mail sending failed' })
              }
      
              if(info){
                console.log({ type:'success', message: 'Mail was sent successfully' })
              }
            });
          }
        }
  
        return {
          id: doc.id,
          ...doc.data(),
          url: getDownloadURL(fileRef("payments/" + doc.data().transid))
        }
      }).catch((error) => {
        console.error(error)
        return null
      })

    } catch (error) {
      console.error(error)
      return null
    }
})

const delete_payment = asyncHandler( async(_, { id }, context) => {
  try {
    if (!id) {
      return null
    }

    await deleteDoc(docRef("payments", id))
    .then(_ => true)
    .catch(_ => false)

  } catch (error) {
    console.error(error)
    return false
  }
})

const get_payments = asyncHandler( async (parent, args) => {
  const { uid, provider, transid, fullname, date, _status } = args;
  // console.log({ uid, provider, transid, fullname, date });

  let query = await getDocs(Payments);
  if (uid && uid !== "") {
    query = query.docs.filter(doc => doc.data().uid.match(new RegExp(uid, "i")));
  }
  
  if (provider && provider !== "") {
    query = query.docs.filter(doc => doc.data().provider.match(new RegExp(provider, "i")));
  }

  if (transid && transid !== "") {
    query = query.docs.filter(doc => doc.data().transid.match(new RegExp(transid, "i")));
  }

  if (fullname && fullname !== "") {
    query = query.docs.filter(doc => doc.data().fullname.match(new RegExp(fullname, "i")));
  }

  if (date && date !== "") {
    query = query.docs.filter(doc => doc.data().date.match(new RegExp(date, "i")));
  }

  if (_status) {
    query = query.docs.filter(doc => doc.data()._status.match(new RegExp(_status, "i")));
  }

  const data = query.docs
  return data.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    url: getDownloadURL(fileRef("payments/" + doc.data().transid))
  }));
})

module.exports = {
  new_payment,
  update_payment_api,
  update_payment,
  delete_payment,
  get_payments
}