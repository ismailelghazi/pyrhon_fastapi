import { For, Show, createEffect, createSignal } from "solid-js";
import { fetcher } from '../Helpers/FetchHelper';
import { useNavigate } from "@solidjs/router";
import Navbar from "./Components/Navbar";
import Swal from 'sweetalert2';

function IndexProduct() {
    const [products, setProducts] = createSignal(null);
    const [addProduct, setAddProduct] = createSignal(false);
    const [searchQuery, setSearchQuery] = createSignal('');
    const [filteredProducts, setFilteredProducts] = createSignal([]);
    const [headersCount, setHeadersCount] = createSignal(0);
    const [currentPage, setCurrentPage] = createSignal(1);
    const itemsPerPage = 12;
    const navigate = useNavigate();

    createEffect(() => {
        if (products() === null) {
            fetcher('/Product', true, 'GET', null, {}, navigate)
                .then((res) => {
                    setProducts(res);
                    setFilteredProducts(res);
                    const count = Object.keys(res[0]).length;
                    setHeadersCount(count);
                });
        }
    });

    const deleteProduct = (ev) => {
        const id = ev.target.attributes['data-id'].nodeValue;
        Swal.fire({
            title: 'Are you sure?',
            text: `Do you really want to delete product with ID: ${id}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                fetcher(`/Product_delete/${id}`, true, 'DELETE', null, null, navigate)
                    .then(() => {
                        setProducts(products().filter((el) => el.id !== id));
                        setFilteredProducts(filteredProducts().filter((el) => el.id !== id));
                        Swal.fire(
                            'Deleted!',
                            'The product has been deleted.',
                            'success'
                        );
                    });
            }
        });
    };

    const addProductData = (ev) => {
        ev.preventDefault();
        const formData = Object.fromEntries(new FormData(ev.target));
        const jsonformdata = JSON.stringify(formData);
        fetcher('/Product_create', true, 'POST', jsonformdata)
            .then(() => {
                setProducts([...products(), formData]);
                setFilteredProducts([...filteredProducts(), formData]);
                setAddProduct(false);
                Swal.fire(
                    'Added!',
                    'New product has been added.',
                    'success'
                );
            });
    };

    const filterProducts = (query) => {
        const filtered = products().filter(
            (product) =>
                product.Police.toLowerCase().includes(query.toLowerCase()) ||
                product.Matricule.toLowerCase().includes(query.toLowerCase()) ||
                product.assure_id.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredProducts(filtered);
        setCurrentPage(1); // Reset to the first page on new filter
    };

    const paginatedProducts = () => {
        const startIndex = (currentPage() - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredProducts().slice(startIndex, endIndex);
    };

    const totalPages = () => Math.ceil(filteredProducts().length / itemsPerPage);

    return (
        <div class="flex w-screen h-screen bg-gray-100 overflow-x-hidden">
            <Navbar />
            <div class="dashboard-product-container w-full h-full pl-16 py-24">
                <h1 class="text-3xl md:text-5xl text-blue-900 font-bold mb-8">Product Management</h1>
                <div class="bg-white shadow-md w-11/12 rounded-lg p-6 mr-12">
                    <div class="flex flex-col md:flex-row justify-between items-center mb-4">
                        <h2 class="text-xl md:text-3xl font-semibold text-gray-800 mb-4 md:mb-0">Products List</h2>
                        <div class="flex items-center">
                            <input
                                type="text"
                                placeholder="Search"
                                class="py-2 px-3 border border-gray-300 rounded-lg mr-4"
                                value={searchQuery()}
                                onInput={(e) => setSearchQuery(e.target.value)}
                                onKeyUp={() => filterProducts(searchQuery())}
                            />
                            <button class="py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700" onClick={() => setAddProduct(!addProduct())}>
                                {addProduct() ? 'Cancel' : 'Add Product'}
                            </button>
                        </div>
                    </div>
                    <div class="overflow-x-auto styled-scrollbar">
                        <div class="table-content-product min-w-full">
                            <div class="table-head grid bg-gray-200 text-gray-700 w-[200%] font-semibold py-2 px-4 rounded-t-lg"
       style={{"grid-template-columns":`repeat(${headersCount()},1fr)`}}>
                                <span class="col-span-1">ID</span>
                                <span class="col-span-1">Police</span>
                                <span class="col-span-1">Date Emission</span>
                                <span class="col-span-1">Date Effet</span>
                                <span class="col-span-1">Marque</span>
                                <span class="col-span-1">Matricule</span>
                                <span class="col-span-1">Acte</span>
                                <span class="col-span-1">Date Fin</span>
                                <span class="col-span-1">Attestation</span>
                                <span class="col-span-1">Assure ID</span>
                                <span class="col-span-1">Fractionn</span>
                                <span class="col-span-1">Contrat</span>
                                <span class="col-span-1">Periode</span>
                                <span class="col-span-1">Actions</span>
                            </div>
                            <div class="table-body overflow-y-scroll max-h-[600px] w-[200%] styled-scrollbar">
                                <For each={paginatedProducts()}>
                                    {(item) => (
                                        <div class="grid py-2 px-4 border-b border-gray-200 gap-y-8"
                                        style={{"grid-template-columns":`repeat(${Object.keys(products()[0]).length},1fr)`}}>
                                            <div class="col-span-1 truncate">{item.id}</div>
                                            <div class="col-span-1 truncate">{item.Police}</div>
                                            <div class="col-span-1 truncate">{item.Date_Emission}</div>
                                            <div class="col-span-1 truncate">{item.Date_effet}</div>
                                            <div class="col-span-1 truncate">{item.Marque}</div>
                                            <div class="col-span-1 truncate">{item.Matricule}</div>
                                            <div class="col-span-1 truncate">{item.Acte}</div>
                                            <div class="col-span-1 truncate">{item.Date_fin}</div>
                                            <div class="col-span-1 truncate">{item.Attestation}</div>
                                            <div class="col-span-1 truncate">{item.assure_id}</div>
                                            <div class="col-span-1 truncate">{item.Fractionn}</div>
                                            <div class="col-span-1 truncate">{item.Contrat}</div>
                                            <div class="col-span-1 truncate">{item.Periode}</div>
                                            <div class="col-span-1 flex justify-start gap-x-8">
                                                <i class="fa-regular fa-trash-can cursor-pointer text-red-500 hover:text-red-700" data-id={item.id} onClick={deleteProduct}></i>
                                                <i class="fa-solid fa-pen-to-square cursor-pointer" onClick={() => navigate(`/add-reglement/${item.id}`)}></i>
                                            </div>
                                        </div>
                                    )}
                                </For>
                            </div>
                        </div>
                    </div>
                    <Show when={filteredProducts().length > itemsPerPage}>
                        <div class="flex justify-between mt-4">
                            <button
                                class="py-2 px-4 bg-gray-300 rounded-lg hover:bg-gray-400"
                                onClick={() => setCurrentPage(currentPage() - 1)}
                                disabled={currentPage() === 1}
                            >
                                Previous
                            </button>
                            <div class="flex items-center">
                                Page {currentPage()} of {totalPages()}
                            </div>
                            <button
                                class="py-2 px-4 bg-gray-300 rounded-lg hover:bg-gray-400"
                                onClick={() => setCurrentPage(currentPage() + 1)}
                                disabled={currentPage() === totalPages()}
                            >
                                Next
                            </button>
                        </div>
                    </Show>
                    <Show when={addProduct()}>
                        <div class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                            <div class="bg-white p-4 rounded-lg shadow-inner w-full md:w-3/4 lg:w-1/2">
                                <form onSubmit={addProductData}>
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div class="flex flex-col">
                                            <label for="Police" class="mb-1 font-medium text-gray-700">Police</label>
                                            <input type="text" name="Police" class="py-2 px-3 border border-gray-300 rounded-lg" required />
                                        </div>
                                        <div class="flex flex-col">
                                            <label for="Date_effet" class="mb-1 font-medium text-gray-700">Date Effet</label>
                                            <input type="date" name="Date_effet" class="py-2 px-3 border border-gray-300 rounded-lg" required />
                                        </div>
                                        <div class="flex flex-col">
                                            <label for="Acte" class="mb-1 font-medium text-gray-700">Acte</label>
                                            <input type="text" name="Acte" class="py-2 px-3 border border-gray-300 rounded-lg" required />
                                        </div>
                                        <div class="flex flex-col">
                                            <label for="Date_fin" class="mb-1 font-medium text-gray-700">Date Fin</label>
                                            <input type="date" name="Date_fin" class="py-2 px-3 border border-gray-300 rounded-lg" required />
                                        </div>
                                        <div class="flex flex-col">
                                            <label for="Fractionn" class="mb-1 font-medium text-gray-700">Fractionn</label>
                                            <input type="text" name="Fractionn" class="py-2 px-3 border border-gray-300 rounded-lg" required />
                                        </div>
                                        <div class="flex flex-col">
                                            <label for="Contrat" class="mb-1 font-medium text-gray-700">Contrat</label>
                                            <input type="text" name="Contrat" class="py-2 px-3 border border-gray-300 rounded-lg" required />
                                        </div>
                                        <div class="flex flex-col">
                                            <label for="Periode" class="mb-1 font-medium text-gray-700">Periode</label>
                                            <input type="text" name="Periode" class="py-2 px-3 border border-gray-300 rounded-lg" required />
                                        </div>
                                        <div class="flex flex-col">
                                            <label for="Marque" class="mb-1 font-medium text-gray-700">Marque</label>
                                            <input type="text" name="Marque" class="py-2 px-3 border border-gray-300 rounded-lg" required />
                                        </div>
                                        <div class="flex flex-col">
                                            <label for="Date_Emission" class="mb-1 font-medium text-gray-700">Date Emission</label>
                                            <input type="date" name="Date_Emission" class="py-2 px-3 border border-gray-300 rounded-lg" required />
                                        </div>
                                        <div class="flex flex-col">
                                            <label for="Matricule" class="mb-1 font-medium text-gray-700">Matricule</label>
                                            <input type="text" name="Matricule" class="py-2 px-3 border border-gray-300 rounded-lg" required />
                                        </div>
                                        <div class="flex flex-col">
                                            <label for="Attestation" class="mb-1 font-medium text-gray-700">Attestation</label>
                                            <input type="text" name="Attestation" class="py-2 px-3 border border-gray-300 rounded-lg" required />
                                        </div>
                                        <div class="flex flex-col">
                                            <label for="assure_id" class="mb-1 font-medium text-gray-700">Assure ID</label>
                                            <input type="text" name="assure_id" class="py-2 px-3 border border-gray-300 rounded-lg" required />
                                        </div>
                                    </div>
                                    <div class="mt-4 flex justify-between">
                                        <button type="button" class="py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600" onClick={() => setAddProduct(false)}>Cancel</button>
                                        <button type="submit" class="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Add Product</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </Show>
                </div>
            </div>
        </div>
    );
}

export default IndexProduct;
