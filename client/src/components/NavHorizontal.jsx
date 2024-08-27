function NavHorizontal(props) {
    return (
        <div className="nav-horizontal-container">
            <ul className="nav-horizontal">
                {props.children}
            </ul>
        </div>
    );
}

export default NavHorizontal;
