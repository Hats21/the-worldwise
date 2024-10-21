import Logo from "../Logo/Logo";
import Footer from "../Footer/Footer";
import AppNav from "../AppNav/AppNav";
import styles from "./Sidebar.module.css";
import { Outlet } from "react-router-dom";
function SideBar() {
  return (
    <div className={styles.sidebar}>
      <Logo />
      <AppNav />
      {/* <p>List of cities</p> */}
      <Outlet />
      <Footer />
    </div>
  );
}

export default SideBar;
