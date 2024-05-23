import { createEffect, createSignal } from "solid-js";
import { useParams, useNavigate } from "@solidjs/router";
import { fetcher } from '../Helpers/FetchHelper';
import Swal from 'sweetalert2';
import Navbar from "./Components/Navbar";

const AddReglement = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [reglement, setReglement] = createSignal(null);

  createEffect(() => {
    fetcher(`/reglements/product/${params.id}`, true, 'GET', null, {}, navigate)
      .then((res) => {
          setReglement(res[res.length -1])
          console.log(res,res[res.length -1])
      })
      .catch((err) => Swal.fire('Error', err.message, 'error'));
  });

  return (
    <div class="flex  w-screen h-screen bg-gray-100 overflow-x-hidden">
      <Navbar/>
      <div class="flex flex-grow justify-center items-center py-12">
        <div class="bg-white shadow-lg rounded-lg p-8 w-full max-w-4xl">
          <h1 class="text-3xl font-bold text-blue-900 mb-8 text-center">Add Reglement</h1>
          {reglement() && (
            <form class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="cin" class="block text-sm font-medium text-gray-700">CIN</label>
                <input type="text" id="cin" value={reglement().cin} disabled class="mt-1 py-2 px-3 border border-gray-300 rounded-lg w-full" />
              </div>
              <div>
                <label for="nom_assure" class="block text-sm font-medium text-gray-700">Nom Assure</label>
                <input type="text" id="nom_assure" value={reglement().nom_assure} disabled class="mt-1 py-2 px-3 border border-gray-300 rounded-lg w-full" />
              </div>
              <div>
                <label for="date_reglement" class="block text-sm font-medium text-gray-700">Date de reglement</label>
                <input type="date" id="date_reglement" class="mt-1 py-2 px-3 border border-gray-300 rounded-lg w-full" />
              </div>
              <div>
                <label for="prime_totale" class="block text-sm font-medium text-gray-700">Prime Total</label>
                <input type="text" id="prime_totale" value={reglement().prime_totale} disabled class="mt-1 py-2 px-3 border border-gray-300 rounded-lg w-full" />
              </div>
              <div>
                <label for="type_de_reglement" class="block text-sm font-medium text-gray-700">Type de reglement</label>
                <input type="text" id="type_de_reglement" class="mt-1 py-2 px-3 border border-gray-300 rounded-lg w-full" />
              </div>
              <div>
                <label for="reglement" class="block text-sm font-medium text-gray-700">Reglement</label>
                <input type="text" id="reglement" value={reglement().reglement} class="mt-1 py-2 px-3 border border-gray-300 rounded-lg w-full" />
              </div>
              <div>
                <label for="reste" class="block text-sm font-medium text-gray-700">Rest</label>
                <input type="text" id="reste" value={reglement().prime_totale - reglement().reglement} disabled class="mt-1 py-2 px-3 border border-gray-300 rounded-lg w-full" />
              </div>
              <div>
                <label for="matricule" class="block text-sm font-medium text-gray-700">Matricule</label>
                <input type="text" id="matricule" value={reglement().matricule} disabled class="mt-1 py-2 px-3 border border-gray-300 rounded-lg w-full" />
              </div>
              <div class="col-span-1 md:col-span-2 flex justify-center">
                <button type="submit" class="mt-4 py-2 px-4 bg-green-500 text-white rounded-lg">Ajoute</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddReglement;
