const Reservation = require('../models/Reservation');
const db = require('../helpers/database');

module.exports = {
    addReservation,
}

function addReservation(req,res){
    let phoneId = req.swagger.params.phoneId.value;
    const client_capacity = 3
    let date = req.body.date;
    let state = req.body.state;
    const query = {date}

    db.openConnection();

    Reservation.findOne(query , (err,reservation) =>{
        if(err){
            res.json('err')
        }else{
            let added = false;
            if(!reservation){
                console.log('cas 0');
                //case : no reservation in this day 
                const newReservation = new Reservation({
                    date : date,
                    client_capacity : 3,
                })
                added = true
                let slot = [];
                slot.push({u_id : phoneId,state : state})
                newReservation.slots.push(slot)
                newReservation.save((err,newReservation) =>{
                    return res.json(newReservation);
                })
            }
            else{
                //Case reservation alredy exist for this day
            reservation.slots.map((slot) =>{
                if(slot.length < client_capacity){
                    console.log('Case 1')
                    added = true
                    slot.push({u_id : phoneId,state : state})
                    reservation.save((err,reservation) =>{
                        if(err){
                            res.json(err)
                        }else{
                            res.status(200).json(reservation)
                        }
                    })
                }else{
                    for(let i = 0;i < client_capacity ; i++){
                        if(slot[i].state == "free"){
                            slot.splice(i,1);
                            slot.push({u_id : phoneId,state : state})
                            console.log('case2'+slot[i].state)
                            added = true
                            reservation.save((err,reservation) =>{
                                if(err){
                                    res.json(err)
                                }else{
                                    res.status(200).json(reservation)
                                }
                            })
                        }
                    }
                }
            })

            if(!added){
                console.log('case 3')
                added = true
                let newSlot = []
                newSlot.push({u_id : phoneId,state : state});
                reservation.slots.push(newSlot);
                reservation.save((err,reservation) =>{
                    if(err){
                        return res.json(err)
                    }else{
                        return res.json(reservation)
                    }
                })
            }
            }
        }
    }).then(()=>{
        db.closeConnection();
      })
    


    /*Reservation.find({},(err,reservation) =>{
        res.json(reservation);
    })*/
}


