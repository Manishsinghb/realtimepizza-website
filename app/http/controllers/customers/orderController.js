const Order = require('../../../models/order')
const moment = require('moment')
function orderController (){
    return{
        async store(req,res){
          
          //validate request
          /*const {phone, address} = req.body
          if(!phone||!address){
            req.flash('error','All fields are reqired');
            return res.redirect('/cart')
          }
          const order = new Order({
            customerId:req.user._id,
            items:req.session.cart.items,
            phone,
            address
          });
          order.save().then(result =>{
           Order.populate(result,{path:'customerId'},(err,placedOrder) =>{
              req.flash('success','order placed successfully')
              delete req.session.cart
              const eventEmitter = req.app.get('eventEmitter')
              eventEmitter.emit('orderPlaced',result)
             return res.redirect('/customer/orders')
          })
            

          }).catch(err =>{
            req.flash('error',"something went wrong")
            return res.redirect('/cart')
          })*/
          try {
            // Validate request
            const { phone, address} = req.body;
            if (!phone || !address) {
             return res.status({message:' All fields are required'}); // P

               // req.flash('error', 'All fields are required');
               // return res.redirect('/cart');
            }
            
            const order = new Order({
                customerId: req.user._id,
                items: req.session.cart.items,
                phone,
                address
            });

            const result = await order.save();

            // Populate the 'customerId' field
            const placedOrder = await Order.populate(result, { path: 'customerId' });

            req.flash('success', 'Order placed successfully');
            delete req.session.cart;
           //stripe payment

            const eventEmitter = req.app.get('eventEmitter');
            eventEmitter.emit('orderPlaced', result);
            
            
            // return res.json({message:' Order placed successfully'}); // P
            return res.redirect('/customer/orders');
        } catch (error) {
            console.error(error);
            req.flash('error', 'Something went wrong');
            return res.redirect('/cart');
        }

        
        },
        async index(req,res){
            const orders = await Order.find({customerId:req.user._id},
              null,
              {sort:{'createdAt':-1}})
              res.header('Cache-Control','no-cache,private,no-store,must-revalidate,max-state=0,post-check=0,pre-check=0')
            res.render('customers/orders',{orders:orders,moment:moment})
            
        },
        async show(req, res) {
          const order = await Order.findById(req.params.id)
          // Authorize user
          if(req.user._id.toString() === order.customerId.toString()) {
              return res.render('customers/singleOrder', { order })
          }
          return  res.redirect('/')
      }

        
         }

    }

module.exports = orderController
