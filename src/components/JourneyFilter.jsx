import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';


const JourneyFilter = () => {
  const { token } = useContext(AuthContext);
  const [journeys, setJourneys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchJourneys = async () => {
      setLoading(true);
      try {
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(
          `http://localhost:3000/journeys?page=${currentPage}&limit=${itemsPerPage}`,
          { headers }
        );

        const data = await response.json();

        if (response.ok) {
          if (Array.isArray(data)) {
            setJourneys(data);
            setTotalPages(1);
          } else if (data.journeys && Array.isArray(data.journeys)) {
            setJourneys(data.journeys);
            setTotalPages(data.totalPages ? Math.max(1, data.totalPages) : 1);
          } else if (data.data && Array.isArray(data.data)) {
            setJourneys(data.data);
            setTotalPages(data.totalPages ? Math.max(1, data.totalPages) : 1);
          } else {
            setJourneys([]);
            setTotalPages(1);
          }
        } else {
          alert(data.message || 'Failed to fetch journeys');
          setJourneys([]);
          setTotalPages(1);
        }
      } catch (error) {
        console.error('Fetch journeys error:', error);
        alert('An error occurred while fetching journeys.');
        setJourneys([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchJourneys();
  }, [token, currentPage]);

  const hasNextPage = currentPage < totalPages;

  return (
    <div className="journey-container">
      <h2 className="journey-title">Journey Listings</h2>

      {loading ? (
        <p className="journey-message">Loading journeys...</p>
      ) : journeys.length === 0 ? (
        <p className="journey-message">No journeys found.</p>
      ) : (
        <>
          <table className="journey-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Route</th>
                <th>Exchanges</th>
                <th>Price ($)</th>
                <th>Duration (hrs)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {journeys.map((j, index) => {
                const journeyDetails = (Array.isArray(j.journey) && j.journey.length > 0) ? j.journey[0] : {};
                const routeArray = Array.isArray(journeyDetails.route) ? journeyDetails.route : [];

                return (
                  <tr key={j.id ?? index}>
                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td>{routeArray.length > 0 ? routeArray.join(' → ') : 'N/A'}</td>
                    <td>{journeyDetails.exchanges ?? 'N/A'}</td>
                    <td>{journeyDetails.price ?? 'N/A'}</td>
                    <td>{journeyDetails.duration ?? 'N/A'}</td>
                    <td>
                      <button className="view-btn" onClick={() => navigate(`/journey/${j.id}`)}>
                        View Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="pagination-controls">
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="pagination-text">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={!hasNextPage}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default JourneyFilter;
