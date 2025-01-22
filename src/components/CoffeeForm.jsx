
import { useState } from 'react';
import { coffeeOptions } from '../utils'
import Modal from './Modal';
import Authentication from './Authentication';
import useAuth from '../hooks/useAuth';
import { doc, setDoc } from 'firebase/firestore/lite';
import { db } from '../../firebase';

function CoffeeForm(props) {

    const { isAuthenticated } = props;
    
    const { globalData, setGlobalData, globalUser } = useAuth();

    // Show modal on clicking 'add entry' for unauthenticated user
    const [showModal, setShowModal] = useState(false);
    // Indicate which of the main displayed coffee types is clicked
    const [selectedCoffee, setSelectedCoffee] = useState(null);
    // Show the other selectable coffee types
    const [showCoffeeTypes, setShowCoffeeTypes] = useState(false);
    // Determine the coffee cost
    const [coffeeCost, setCoffeeCost] = useState(0);
    // Store the hour value
    const [hour, setHour] = useState(0);
    // Store the minute value
    const [minute, setMinute] = useState(0);

    // Determine whether the data entry is being processed
    const [isLoading, setIsLoading] = useState(false);
    // Store error message
    const [errorMessage, setErrorMessage] = useState('');

    async function handleSubmitForm() {

        // Reset error message
        setErrorMessage('');

        // Prevent un-authenticated users from submitting the form
        if (!isAuthenticated) {
            
            setShowModal(true);
            return;
        }

        // Return with an error message if there is any incomplete form inputs
        switch (true) {
            case !selectedCoffee:
                setErrorMessage('Coffee type has not been selected!');
                return;
            case coffeeCost < 1:
                setErrorMessage('Please specify the coffee cost...');
                return;
            case minute < 1:
                setErrorMessage('Please specify the minute since the coffee cosumption...');
                return;        
            default:
                break;
        }

        try {
            setIsLoading(true);

            // Create a new data object to store the coffee tracking entry
            const newGlobalData = {
                ...(globalData || {}),
            };

            // Get the current time that has passed since 1 January 1970
            const nowTime = Date.now();
            // Sum up the inputs of hour and minute into milliseconds
            const timeToSubtract = (hour * 60 * 60 * 1000) + (minute * 60 * 1000);
            // Calculate the timestamp when the coffee was consumed
            const timestamp = nowTime - timeToSubtract;

            // Store the necessary data to be stored in one variable
            const newData = {
                name: selectedCoffee,
                cost: coffeeCost
            };

            // Append the new coffee entry
            newGlobalData[timestamp] = newData;

            // console.log(timestamp, selectedCoffee, coffeeCost);

            // Update the state of global data
            setGlobalData(newGlobalData);

            // Persist the new global data to the firestore database
            const userRef = doc(db, 'users', globalUser.uid);
            // This will merge the new data to the existing data in the database
            const res = await setDoc(userRef, {
                [timestamp]: newData
            }, {merge: true});

            // Reset form inputs
            setSelectedCoffee(null);
            setCoffeeCost(0);
            setHour(0);
            setMinute(0);

        } catch (error) {
            console.log(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    function handleCloseModel() {
        setShowModal(false);
    }
    
    return (
        <>
            {(showModal && 
                <Modal handleCloseModal={handleCloseModel}>
                    <Authentication handleCloseModal={handleCloseModel} />
                </Modal>
            )}
            <div className="section-header">
                <i className="fa-solid fa-pencil"></i>
                <h2>Start Tracking Today</h2>
            </div>

            {errorMessage && (<div className="error-message">{errorMessage}</div>)}

            <h4>Select coffee type</h4>
            <div className="coffee-grid">
                {coffeeOptions.slice(0, 5).map((option, optionIndex) => {

                    return (
                        <button key={optionIndex} className={"button-card " + (option.name === selectedCoffee ? 'coffee-button-selected' : '')} onClick={() => {
                            setSelectedCoffee(option.name);
                            setShowCoffeeTypes(false);
                        }}>
                            <h4>{option.name}</h4>
                            <p>{option.caffeine} mg</p>
                        </button>
                    );
                })}

                <button className={"button-card " + (showCoffeeTypes ? 'coffee-button-selected' : '')} onClick={() => {
                    setShowCoffeeTypes(true);
                    setSelectedCoffee(null);
                }}>
                    <h4>Other</h4>
                    <i className="fa-regular fa-hand-pointer"></i>
                </button>
            </div>

            {showCoffeeTypes && (
                <select name="coffee-list" id="coffee-list" onChange={(e) => setSelectedCoffee(e.target.value)}>
                    <option value="{null}">Select other coffee type</option>
                    {coffeeOptions.map((option, optionIndex) => {

                        return (
                            <option key={optionIndex} value="{option.name}">
                                {option.name} {option.caffeine} mg
                            </option>
                        );
                    })}
                </select>
            )}

            <h4>Add the cost ($)</h4>
            <input type="number" className="w-full" placeholder='4.50' value={coffeeCost} onChange={(e) => setCoffeeCost(e.target.value)} />

            <h4>Time since consumption</h4>
            <div className="time-entry">
                <div>
                    <h6>Hours</h6>
                    <select id="hours-select" onChange={(e) => setHour(e.target.value)}>
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23].map((hour, hourIndex) => {
                            return (
                                <option key={hourIndex} value={hour}>{hour}</option>
                            );
                        })}
                    </select>
                </div>

                <div>
                    <h6>Mins</h6>
                    <select id="mins-select" onChange={(e) => setMinute(e.target.value)}>
                        {[0, 5, 10, 15, 30, 45].map((min, minIndex) => {
                            return (
                                <option key={minIndex} value={min}>{min}</option>
                            );
                        })}
                    </select>
                </div>

                <button onClick={handleSubmitForm} disabled={isLoading}>
                    <p>{isLoading ? 'Processing...' : 'Add Entry'}</p>
                </button>
            </div>
        </>
    );
}

export default CoffeeForm;