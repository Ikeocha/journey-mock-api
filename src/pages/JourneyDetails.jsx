import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const JourneyDetails = () => {
  const { token } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [journey, setJourney] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJourney = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`http://localhost:3000/journeys/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Failed to fetch journey');
        }

        const data = await res.json();

        console.log('Fetched journey data:', data);

        if (Array.isArray(data)) {
          const matchedJourney = data.find(j => j.id === id);
          if (matchedJourney) {
            setJourney(matchedJourney);
          } else {
            setError(`Journey with id "${id}" not found.`);
          }
        } else if (data && data.id === id) {
          setJourney(data);
        } else {
          setError(`Journey data does not match requested id: ${id}`);
        }
      } catch (err) {
        console.error('Fetch journey error:', err);
        setError(err.message || 'Error fetching journey details');
      } finally {
        setLoading(false);
      }
    };

    fetchJourney();
  }, [id, token]);

  if (loading) return <p>Loading journey details...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!journey) return <p>No journey found</p>;


  const origin = journey.origin ?? (Array.isArray(journey.route) ? journey.route[0] : 'N/A');
  const destination = journey.destination ?? (Array.isArray(journey.route) ? journey.route[journey.route.length - 1] : 'N/A');
  const departure = journey.departure ?? 'N/A';

  return (
    <div className="journey-details" style={{ padding: '20px' }}>
      <h2>Journey Details on {journey.id}</h2>

      <p><strong>Origin:</strong> {origin}</p>
      <p><strong>Destination:</strong> {destination}</p>
      <p><strong>Departure:</strong> {departure}</p>

      <h3>Route Details</h3>

      {Array.isArray(journey.journey) && journey.journey.length > 0 ? (
        <table border="1" cellPadding="8" cellSpacing="0" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>#</th>
              <th>Route</th>
              <th>Exchanges</th>
              <th>Price ($)</th>
              <th>Duration (hours)</th>
            </tr>
          </thead>
          <tbody>
            {journey.journey.map((segment, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>{Array.isArray(segment.route) ? segment.route.join(' → ') : 'N/A'}</td>
                <td>{segment.exchanges != null ? segment.exchanges : 'N/A'}</td>
                <td>{segment.price != null ? segment.price : 'N/A'}</td>
                <td>{segment.duration != null ? segment.duration : 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : Array.isArray(journey.route) && journey.route.length > 0 ? (
        <table border="1" cellPadding="8" cellSpacing="0" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>#</th>
              <th>Route</th>
              <th>Exchanges</th>
              <th>Price ($)</th>
              <th>Duration (hours)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>{journey.route.join(' → ')}</td>
              <td>{journey.exchanges ?? 'N/A'}</td>
              <td>{journey.price ?? 'N/A'}</td>
              <td>{journey.duration ?? 'N/A'}</td>
            </tr>
          </tbody>
        </table>
      ) : (
        <p>No route details available.</p>
      )}

      <button onClick={() => navigate(-1)} style={{ marginTop: '20px' }}>
        Back
      </button>
    </div>
  );
};

export default JourneyDetails;
