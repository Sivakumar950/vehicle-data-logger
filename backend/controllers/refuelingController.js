const supabase = require('../config/supabase');

const getRefuelingLog= async(req,res) => {
    const userId = req.user.id;
    const { vehicleId } = req.params;

    const{ data, error}= await supabase.from('refueling_logs').select('*').eq('vehicle_id',vehicleId).eq('user_id',userId).order('date',{ascending:false});

    if(error){
        return res.status(500).json({error : error.message});
    }
    res.status(200).json(data);
};
const getRefuelingLogById = async(req,res) => {
    const userId = req.user.id;
    const {id} = req.params;

    const{data,error} = await supabase.from('refueling_logs').select('*').eq('id',id).eq('user_id',userId).single();

    if(error){
        return res.status(500).json({error : "Refueling log not found"});
    }
    res.status(200).json(data);
};

const createRefuelingLog= async(req,res) => {
    const userId= req.user.id;
    const {vehicleId} = req.params;

    const{ date, fuel_type , quantity, cost , odometer , notes} = req.body;

    const { data,error} = await supabase.from('refueling_logs').insert([{vehicle_id: vehicleId,user_id: userId ,date , fuel_type, quantity, cost,odometer , notes}]).select().single();

    if(error){
        return res.status(400).json({error: error.message});
    }
    res.status(201).json(data);
};

const updateRefuelingLog = async(req,res) => {
    const userId = req.user.id;
    const {id } = req.params;
    const{date , fuel_type, quantity, cost,odometer, notes} = req.body;

    const{data, error } = await supabase.from('refueling_logs').update({ date,fuel_type , quantity ,cost , odometer, notes }).eq('id',id).eq('user_id',userId).select().single();

    if(error){
        return res.status(400).json({error: error.message});
    }

    res.status(200).json(data);
};

const deleteRefuelingLog = async(req,res) => { 
    const userId = req.user.id;
    const { id } = req.params;
    const { error } = await supabase.from('refueling_logs').delete().eq('id',id).eq('user_id',userId);

    if(error){
        return res.status(400).json({ error: error.message});
    }
    res.status(200).json({ message : ' Refueling log deleted successfully'});

};

module.exports = { getRefuelingLog , getRefuelingLogById , createRefuelingLog , updateRefuelingLog , deleteRefuelingLog };