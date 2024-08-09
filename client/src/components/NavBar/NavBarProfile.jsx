import PropTypes from 'prop-types'

function NavBarProfile(props) {
    if (props.isLoggedIn) {
        return (
            <>
                <li className = "NavBarProfile">
                    <a href="#"><img src={props.icon} alt = ""></img></a>
                    <h3><a href="#">{props.name}</a></h3>
                    <h4><a href="#">{props.balance.toFixed(2)} ₽</a></h4>
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
