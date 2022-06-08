import React, { useState, useEffect, useRef } from "react";

const Home = () => {
	const [dato, setDato] = useState({});
	const [lista, setLista] = useState([]);
	const ref = useRef(null); // utilizamos este hook para forzar que el input se ponga a 0 cuando pulsamos enter
	// const [icon, setIcon] = useState("none");

	// fetch GET para que cargue las tareas guardadas en la api cuando se carga la pagina
	useEffect(() => {
		// GET request using fetch inside useEffect React hook
		fetch(
			"https://assets.breatheco.de/apis/fake/todos/user/miguelpadilla",
			{
				method: "GET",
				headers: { "Content-Type": "application/json" },
			}
			// lo de method y headers no es necesario en un GET, pero lo pusimos porque fallaba otra cosa y no detectabamos el fallo
		)
			.then((response) => response.json())
			.then((data) => setLista(data));
	}, []);

	// fetch PUT para cargar las tareas actualizadas en el servidor
	useEffect(() => {
		fetch(
			"https://assets.breatheco.de/apis/fake/todos/user/miguelpadilla",
			{
				method: "PUT",
				body: JSON.stringify(lista),
				headers: {
					"Content-Type": "application/json",
				},
			}
		)
			.then((resp) => {
				// console.log(resp.ok); // Será true (verdad) si la respuesta es exitosa.
				// console.log(resp.status); // el código de estado = 200 o código = 400 etc.
				// console.log(resp.text()); // Intentará devolver el resultado exacto como cadena (string)
				return resp.json(); // (regresa una promesa) will try to parse the result as json as return a promise that you can .then for results
			})
			.then((data) => {
				//Aquí es donde debe comenzar tu código después de que finalice la búsqueda
				console.log(data); //esto imprimirá en la consola el objeto exacto recibido del servidor
			})
			.catch((error) => {
				//manejo de errores
				console.log(error);
			});
	}, [lista]); // [] el corchete vacio hace que el fetch se ejecute 1 vez cada vez que se ejecute la pagina
	// el [lista] hace que el fetch se ejecute cada vez que la variable LISTA cambia

	// POST // para crear usuario, lanzarlo una
	// useEffect(() => {
	// 	// POST request using fetch inside useEffect React hook
	// 	const requestOptions = {
	// 		method: "POST",
	// 		headers: { "Content-Type": "application/json" },
	// 		body: JSON.stringify({}),
	// 	};
	// 	fetch(
	// 		"https://assets.breatheco.de/apis/fake/todos/user/miguelpadilla",
	// 		requestOptions
	// 	).then((response) => response.json());

	// empty dependency array means this effect will only run once (like componentDidMount in classes)
	// }, []);

	// aqui vamos registrando lo que se introduce en el input con el onchange de abajo
	function handleEntrada(e) {
		setDato({ label: e.target.value, done: false }); // aqui guardamos como un objeto en lugar de como string como haciamos en la anterior todo sin fetch
	}

	// funcion para añadir la tarea que hemos registrado con handle entrada a la lista al pulstar enter
	function addToList(e) {
		e.preventDefault(); // quito la accion predeterminada que tiene el submit, que es recargar la pagina cuando lo utilizo (pq entonces me está borrando el array al recargar pagina)
		setLista(lista.concat(dato)); // con CONCAT añado al array LISTA el valor que entra en DATO al hacer SUBMIT .
		ref.current.value = ""; // aqui usamos el useRef
	}

	// funcion que borra la lista con el boton
	const limpiar = () => {
		setLista([]);
	};

	// funcion para que la X se muestre cuando pase por encima
	// function showIcon() {
	// 	if (icon === "") {
	// 		setIcon("none");
	// 	} else setIcon("");
	// }

	const deleteTask = (i) => {
		let newList = lista.filter((task, index) => i !== index); // aqui habia puesto "{i !==index}" y con las llaves fallaba, borraba todo
		setLista(newList);
	};

	// contador tareas pendientes//
	let tasksleft =
		lista.length == "0"
			? "No tasks, add a task"
			: lista.length + " item left";

	// el onSubmit ya hace que al hacer ENTER , capturemos el dato, no tenemos que hacer nada extraño como onkeypress ni nada de eso
	return (
		<>
			<div className="container">
				<h1>todos</h1>
				<ul className="list-group list-group-flush collapse d-flex justify-content-end">
					<li className="list-group-item">
						<form onSubmit={addToList}>
							<input
								ref={ref}
								className="form-control"
								type="text"
								placeholder="What needs to be done?"
								aria-label="default input example"
								required // con esto obligo a que se introduzca un valor
								onChange={handleEntrada}
							/>
						</form>
					</li>

					{/* // aqui introduzco lo que tengo en array lista haciendo map del array lista y le añado el icono de la X roja */}
					{lista.map((tarea, i) => {
						return (
							<li
								className="list-group-item"
								// onMouseEnter={showIcon}
								// onMouseLeave={showIcon}
								key={i}>
								{tarea.label}{" "}
								{/* /En el ejercicio original solo tenia que colocar tarea, no tarea.label, pero cuando conectamos con la api, al recuperar un array de objetos, hay que ponerle la propiedad */}
								<span>
									<i
										className="fa-solid fa-xmark "
										onClick={() => deleteTask(i)} // puesta arrow function porque sino fallaba el deletetask, cada vez que escribía llamaba a la funcion. Así se ejecuta solo cuando la llamo (igual que en onmouseenter)
										// style={{ display: icon }}
									></i>
								</span>
							</li>
						);
					})}
				</ul>
				<div id="taskleft">{tasksleft}</div>

				<br />
				<div className="container d-flex justify-content-center">
					<button
						type="button"
						className="btn btn-outline-success justify-content-center"
						onClick={limpiar}>
						Limpiar
					</button>
				</div>
			</div>
		</>
	);
};

export default Home;
