import PropTypes from 'prop-types'

function NavBarItem(props) {

    return(
        <>
            <li className='NavBarItem'><a href={props.link}>{props.text}</a></li>
        </>
    );
}

NavBarItem.propTypes = {
    text: PropTypes.string,
    link: PropTypes.string
}

NavBarItem.defaultProps = {
    text: "Главная",
    link: "#"
}

export default NavBarItem
