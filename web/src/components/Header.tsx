import Logo from "../assets/logo.png";

const Header = () => {
  return <div className="header">
    <img className="logo-image" src={Logo} alt="GPT" />
  </div>;
};

export default Header;
