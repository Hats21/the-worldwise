import SideBar from "../components/Sidebar/SideBar";
import Map from "../components/Map/Map";

import styles from "./AppLayout.module.css";
import User from "../components/User/User";
import ProtectedRoute from "./ProtectedRoute";

// import AppNav from "../components/AppNav";
function AppLayout() {
  return (
    <ProtectedRoute>
      <div className={styles.app}>
        <SideBar />
        <User />
        <Map />
      </div>
    </ProtectedRoute>
  );
}

export default AppLayout;
