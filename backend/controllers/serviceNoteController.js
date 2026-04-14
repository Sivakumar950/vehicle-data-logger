const supabase = require('../config/supabase');

const getServiceNote = async (req, res) => {
  const userId = req.user.id;
  const { vehicleId } = req.params;
  const { data, error } = await supabase
    .from('service_notes')
    .select('*')
    .eq('vehicle_id', vehicleId)
    .eq('user_id', userId)
    .order('date', { ascending: false });
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.status(200).json(data);
};

const getServiceNoteById = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { data, error } = await supabase
    .from('service_notes')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single();
  if (error) {
    return res.status(404).json({ error: 'Service note not found' });
  }
  res.status(200).json(data);
};

const createServiceNote = async(req,res) =>{
    const userId= req.user.id;
    const { vehicleId } = req.params;
    const{date, title , description , cost , odometer}= req.body;

    let billImageUrl= null;

    if (req.file) {
    const fileName = `${userId}/${Date.now()}_${req.file.originalname}`;
    const { error: uploadError } = await supabase.storage
      .from('bill-images')
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
      });
    if (uploadError) {
      return res.status(400).json({ error: uploadError.message });
    }
    const { data: publicUrlData } = supabase.storage
      .from('bill-images')
      .getPublicUrl(fileName);
    billImageUrl = publicUrlData.publicUrl;
  }
  const { data, error } = await supabase
    .from('service_notes')
    .insert([{ vehicle_id: vehicleId, user_id: userId, date, title, description, bill_image: billImageUrl, cost, odometer }])
    .select()
    .single();
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  res.status(201).json(data);
};

const updateServiceNote = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { date, title, description, cost, odometer } = req.body;
  const updateData = { date, title, description, cost, odometer };

  if (req.file) {
    const fileName = `${userId}/${Date.now()}_${req.file.originalname}`;
    const { error: uploadError } = await supabase.storage
      .from('bill-images')
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
      });
    if (uploadError) {
      return res.status(400).json({ error: uploadError.message });
    }
    const { data: publicUrlData } = supabase.storage
      .from('bill-images')
      .getPublicUrl(fileName);
    updateData.bill_image = publicUrlData.publicUrl;
  }
  const { data, error } = await supabase
    .from('service_notes')
    .update(updateData)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  res.status(200).json(data);
};

const deleteServiceNote = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { error } = await supabase
    .from('service_notes')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  res.status(200).json({ message: 'Service note deleted successfully' });
};
module.exports = {
  getServiceNote,
  getServiceNoteById,
  createServiceNote,
  updateServiceNote,
  deleteServiceNote,
};