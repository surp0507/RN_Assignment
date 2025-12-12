import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AddFormDataScreen from "./AddFormDataScreen";
import GetFormDataScreen from "./GetFormDataScreen";





const Stack = createNativeStackNavigator();

const HomeStack = () => {
    return (
        <>

            <Stack.Navigator initialRouteName="AddFormDataScreen">
                <Stack.Screen
                    name="AddFormDataScreen"
                    component={AddFormDataScreen}
                    options={{ title: 'Add Product' }}
                />
                <Stack.Screen
                    name="GetFormDataScreen"
                    component={GetFormDataScreen}
                    options={{ title: 'Search Product' }}
                />
            </Stack.Navigator>
        </>
    )
}

export default HomeStack;