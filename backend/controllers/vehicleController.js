const supabase= require('../config/supabase');
const getVehicles= async(req,res) => {
    const userId=req.user.id;
    const { data, error } = await supabase.from('vehicles').select('*').eq('user_id',userId).order('created_at',{ascending: false});
    if(error){
        return res.status(500).json({error: error.message});
    }

    res.status(200).json(data);
};


const getVehicleById = async(req,res)=>{
    const userId=req.user.id;
    const { id} = req.params;

    const { data, error } = await supabase.from('vehicles').select('*').eq('id',id).eq('user_id',userId).single();
    if(error){
        return res.status(400).json({error: ' Vehiccle not found'});
    }
    res.status(200).json(data);
};

const createVehicle = async(req,res)=>{
    const userId=req.user.id;
    const{ name,make,model,year,plate_number} = req.body;
    const { data, error } = await supabase.from('vehicles').insert([{ user_id: userId, name , make, model, year, plate_number}]).select().single();

    if(error){
        return res.status(400).json({error: error.message});
    }
    res.status(201).json(data);
};


const updateVehicle = async(req,res)=>{
    const userId= req.user.id;
    const {id} = req.params;

    const { name, make,model,year, plate_number} = req.body;
    const { data, error } = await supabase.from('vehicles').update({name,make,model,year,plate_number}).eq('id',id).eq('user_id',userId).select().single();

    if(error){

        return res.status(400).json({error: error.message});
    }
    res.status(200).json(data);
};

const deleteVehicle= async(req,res) => {
    const userId=req.user.id;
    const {id} = req.params;

    const {error} = await supabase.from('vehicles').delete().eq('id',id).eq('user_id',userId);

    if(error){
        return res.status(400).json({error: error.message});
    }
    res.status(200).json({message: 'Vehicle deleted successfully'});
};


module.exports = {getVehicles,getVehicleById,createVehicle,updateVehicle,deleteVehicle};
