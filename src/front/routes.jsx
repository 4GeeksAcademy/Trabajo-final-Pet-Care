// Import necessary components and functions from react-router-dom.

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";
import PetList from "./components/PetList";
import PetDetails from "./pages/PetDetails";
from api.models import Vacuna

export const router = createBrowserRouter(
  createRoutesFromElements(
    // CreateRoutesFromElements function allows you to build route elements declaratively.
    // Create your routes here, if you want to keep the Navbar and Footer in all views, add your new routes inside the containing Route.
    // Root, on the contrary, create a sister Route, if you have doubts, try it!
    // Note: keep in mind that errorElement will be the default page when you don't get a route, customize that page to make your project more attractive.
    // Note: The child paths of the Layout element replace the Outlet component with the elements contained in the "element" attribute of these child paths.

    // Root Route: All navigation will start from here.
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >

      {/* Nested Routes: Defines sub-routes within the BaseHome component. */}
      <Route path="/" element={<Home />} />
      <Route path="/single/:theId" element={<Single />} />  {/* Dynamic route for single items */}
      <Route path="/demo" element={<Demo />} />
      <Route path="/pets" element={<PetList userId={1} />} /> {/* Cambia el userId según tu lógica */}
      <Route path="/pets/:petId" element={<PetDetails />} />
    </Route>
  )
);

// API route to add a new vaccine for a pet
@api.route('/mascotas/<int:mascota_id>/vacunas', methods=['POST'])
def add_vacuna(mascota_id):
    data = request.get_json()

    # Validate that the necessary data is present
    if not data.get('nombre') or not data.get('fecha_aplicacion'):
        return jsonify({"msg": "El nombre y la fecha de aplicación son obligatorios"}), 400

    nueva_vacuna = Vacuna(
        nombre=data.get('nombre'),
        descripcion=data.get('descripcion'),
        fecha_aplicacion=data.get('fecha_aplicacion'),
        mascota_id=mascota_id
    )

    db.session.add(nueva_vacuna)
    db.session.commit()

    return jsonify({"msg": "Vacuna agregada exitosamente", "vacuna": nueva_vacuna.serialize()}), 201