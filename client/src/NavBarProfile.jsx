import PropTypes from 'prop-types'

function NavBarProfile(props) {
    if (props.isLoggedIn) {
        return (
            <>
                <li className = "NavBarProfile">
                    <img src={props.icon} alt = ""/>
                    <h3>{props.name}</h3>
                    <h4>{props.balance.toFixed(2)} ₽</h4>
                </li>
            </>
        );
    }
    
    // return NavBarLogin
   }

NavBarProfile.propTypes = {
    isLoggedIn: PropTypes.bool,
    name: PropTypes.string,
    balance: PropTypes.number,
    icon: PropTypes.string
}

NavBarProfile.defaultProps = {
    isLoggedIn: false,
    name: "Пользователь",
    balance: 0.0,
    icon: "src/assets/img/default_profile_icon.png" 
}

export default NavBarProfile
