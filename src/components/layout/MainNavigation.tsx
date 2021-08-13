import { NavLink } from "react-router-dom";

function MainNavigation() {
  return (
    <nav className="navbar navbar-expand-sm navbar-light bg-light">
      <div className="container-fluid">
        <span className="navbar-brand">Skill Matrix</span>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav">
            <NavLink className="nav-link" to="/matrix" activeClassName="active">
              Matrix
            </NavLink>
            <NavLink
              className="nav-link"
              to="/profile"
              activeClassName="active"
            >
              Profile
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default MainNavigation;
