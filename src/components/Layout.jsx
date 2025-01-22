import { useState } from "react";
import Authentication from "./Authentication";
import Modal from "./Modal";
import useAuth from "../hooks/useAuth";

function Layout(props) {
    
    const { children } = props;

    const [showModal, setShowModal] = useState(false);

    const { globalUser, logout } = useAuth();

    function handleCloseModel() {
        setShowModal(false);
    }

    const header = (
        <header>
            <div>
                <h1 className="text-gradient">CAFFIEND</h1>
                <p>For Coffee Insatiates</p>
            </div>

            {globalUser ? (
                <button onClick={logout}>
                    <p>Logout</p>
                </button>
            ) :
            (
                <button onClick={() => setShowModal(true)}>
                    <p>Sign up free</p>
                    <i className="fa-solid fa-mug-hot"></i>
                </button>
            )}
        </header>
    );

    const footer = (
        <footer>
            <p>
                <span className="text-gradient">Caffiend</span> was made with ❤ using <a href="https://react.dev/" target="_blank">React.JS</a> and <a href="https://www.fantacss.smoljames.com/" target="_blank">FantaCSS</a> design library.
            </p>
        </footer>
    );

    return (
        <div>
            {(showModal && 
                <Modal handleCloseModal={handleCloseModel}>
                    <Authentication handleCloseModal={handleCloseModel} />
                </Modal>
            )}
            {header}
            <main>
                {children}
            </main>
            {footer}
        </div>
    );
}

export default Layout;