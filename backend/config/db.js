require("dotenv").config(); // <--- SIGURADUHING NASA PINAKATAAS ITO!
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

console.log("✅ Supabase Client Initialized!");

module.exports = supabase;