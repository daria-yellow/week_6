import { useState, useEffect } from 'react'
import supabase from '../lib/supabase'

export default function Account({ session }) {
  const [loading, setLoading] = useState(true)
  const [first_name, setFirstname] = useState(null)
  const [last_name, setLastname] = useState(null)
  const [phone, setPhone] = useState(null)
  const [country, setCountry] = useState(null)
  const [city, setCity] = useState(null)
  const [doc_url, setUrl] = useState(null)



  useEffect(() => {
    getProfile()
  }, [session])

  async function getProfile() {
    try {
      setLoading(true)
      const user = supabase.auth.user()

      let { data, error, status } = await supabase
        .from('my_table')
        .select(`first_name, last_name, phone, country, city, doc_url`)
        .eq('id', user.id)
        .single()

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setFirstname(data.first_name)
        setLastname(data.last_name)
        setPhone(data.phone)
        setCountry(data.country)
        setCity(data.city)
        setUrl(data.doc_url)
      }
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  async function updateProfile({ first_name, last_name, phone, country, city, doc_url }) {
    try {
      setLoading(true)
      const user = supabase.auth.user()

      const updates = {
        id: user.id,
        first_name,
        last_name,
        phone,
        country,
        city,
        doc_url,
        updated_at: new Date(),
      }

      let { error } = await supabase.from('my_table').upsert(updates, {
        returning: 'minimal', // Don't return the value after inserting
      })

      if (error) {
        throw error
      }
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-widget">
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="text" value={session.user.email} disabled />
      </div>
      <div>
        <label htmlFor="first_name">First name</label>
        <input
          id="first_name" type="text" value={first_name || ''} onChange={(e) => setFirstname(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="last_name">Last name</label>
        <input
          id="last_name"
          type="text"
          value={last_name || ''}
          onChange={(e) => setLastname(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="phone">Phone</label>
        <input
          id="phone"
          type="text"
          value={phone || ''}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="country">Country</label>
        <input
          id="country"
          type="text"
          value={country || ''}
          onChange={(e) => setCountry(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="city">City</label>
        <input
          id="city"
          type="text"
          value={city || ''}
          onChange={(e) => setCity(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="doc_url">Doc URL</label>
        <input
          id="doc_url"
          type="text"
          value={doc_url || ''}
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>


      <div>
        <button
          className="button block primary"
          onClick={() => updateProfile({ first_name, last_name, phone, country, city })}
          disabled={loading}
        >
          {loading ? 'Loading ...' : 'Update'}
        </button>
      </div>

      <div>
        <button className="button block" onClick={() => supabase.auth.signOut()}>
          Sign Out
        </button>
      </div>
    </div>
  )
}
