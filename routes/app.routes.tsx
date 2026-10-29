import Login from "@/app/screens/Login/Login";
import { createNativeStackNavigator } from "expo-router/build/react-navigation/native-stack/index.js";

const { Navigator, Screen } = createNativeStackNavigator(); 

export function AppRoutes() {
    return(
        <Navigator screenOptions={{ headerShown: false }}>
            <Screen name="screens/Login/Login.tsx"
             component={Login}
            />

        </Navigator>
    )
}
