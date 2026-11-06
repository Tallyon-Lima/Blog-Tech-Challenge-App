import Login from "@/app/screens/Login/Login";
import ManagerUsers from "@/app/screens/ManagerUsers/index";
import { createNativeStackNavigator } from "expo-router/build/react-navigation/native-stack/index.js";

const { Navigator, Screen } = createNativeStackNavigator(); 

export function AppRoutes() {
    return(
        <Navigator screenOptions={{ headerShown: false }}>
            <Screen name="screens/Login/Login.tsx"
             component={Login}
            />
            <Screen name="screens/ManagerUsers/index.tsx"
             component={ManagerUsers}
            />
        </Navigator>
    )
}
