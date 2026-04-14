const supabase = require('../config/supabase');

const getOilChangeLog = async(req,res) => {
    const userId = req.user.id;
    const { vehicleId } = req.params;

    const { data, error }= await supabase.from('oil_change_logs').select('*').eq('vehicle_id',vehicleId).eq('user_id',userId).order('date',{ascending : false});

    if(error){
        return res.status(500).json({error : error.message});
    }
    res.status(200).json(data);
};

const getOilChangeLogById = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { data, error } = await supabase
    .from('oil_change_logs')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single();
  if (error) {
    return res.status(404).json({ error: 'Oil change log not found' });
  }
  res.status(200).json(data);
};

const createOilChangeLog = async (req, res) => {
  const userId = req.user.id;
  const { vehicleId } = req.params;
  const { date, oil_type, cost, odometer, next_change_due, notes } = req.body;
  const { data, error } = await supabase
    .from('oil_change_logs')
    .insert([{ vehicle_id: vehicleId, user_id: userId, date, oil_type, cost, odometer, next_change_due, notes }])
    .select()
    .single();
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  res.status(201).json(data);
};

const updateOilChangeLog = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { date, oil_type, cost, odometer, next_change_due, notes } = req.body;
  const { data, error } = await supabase
    .from('oil_change_logs')
    .update({ date, oil_type, cost, odometer, next_change_due, notes })
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  res.status(200).json(data);
};

const deleteOilChangeLog = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { error } = await supabase
    .from('oil_change_logs')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  res.status(200).json({ message: 'Oil change log deleted successfully' });
};

module.exports = { getOilChangeLog , getOilChangeLogById , createOilChangeLog , updateOilChangeLog , deleteOilChangeLog};