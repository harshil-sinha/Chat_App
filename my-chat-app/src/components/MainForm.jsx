import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MainForm = () => {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [data, setData] = useState({
        name: "",
        room: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const isValid = validation();
        if (isValid) {
            // Here you can navigate to the next page or perform any other action
            navigate(`/chat/${data.room}`, { state: data });
        }
    };

    const validation = () => {
        if (!data.name) {
            setError("Please enter your name");
            return false;
        }
        if (!data.room) {
            setError("Please select a room");
            return false;
        }
        setError("");
        return true;
    };

    return (
        <>
            <div className="px-3 py-4 shadow bg-white text-dark border rounded row">
                <form onSubmit={handleSubmit}>
                    <div className="form-group mb-4">
                        <h2 className='text-warning mb-4'>Welcome To Chatclub</h2>
                    </div>
                    <div className="form-group mb-4">
                        <input type="text" name="name" className='form-control bg-light' placeholder='Enter name' onChange={handleChange} value={data.name} />
                    </div>
                    <div className="form-group mb-4">
                        <select name="room" className='form-select bg-light' onChange={handleChange} value={data.room}>
                            <option value="">Select Room</option>
                            <option value="gaming">Gaming</option>
                            <option value="coding">Coding</option>
                            <option value="socialMedia">Social Media</option>
                        </select>
                    </div>
                    <button type='submit' className='btn btn-warning w-100 mb-2'>Submit</button>
                    {error && <small className='text-danger'>{error}</small>}
                </form>
            </div>
        </>
    )
};

export default MainForm;
