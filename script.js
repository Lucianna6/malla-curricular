// Espera a que todo el contenido de la página se cargue antes de ejecutar el script.
document.addEventListener('DOMContentLoaded', () => {

    // --- DATOS DE LA MALLA CURRICULAR DE ENFERMERÍA ---
    // Aquí se define cada ramo con su ID único, nombre, semestre y requisitos.
    // 'id' es un código corto y único.
    // 'requisitos' es una lista de los 'id' de los ramos que deben estar aprobados.
    const mallaData = [
        // Bimestrales (los consideramos semestre 0 para la organización)
        { id: 'ICB', nombre: 'Introducción a las ciencias biológicas', semestre: 0, requisitos: [] },
        { id: 'IE', nombre: 'Introducción a la enfermería', semestre: 0, requisitos: [] },
        { id: 'IVU', nombre: 'Introducción a la vida universitaria', semestre: 0, requisitos: [] },
        
        // 1er Año (semestres 1 y 2)
        { id: 'EB', nombre: 'Enfermería básica', semestre: 1, requisitos: [] },
        { id: 'CB', nombre: 'Ciencias biológicas', semestre: 1, requisitos: [] },
        { id: 'FE', nombre: 'Filosofía en enfermería', semestre: 1, requisitos: [] },
        { id: 'EOE', nombre: 'Expresión oral y escrita', semestre: 1, requisitos: [] },
        { id: 'PSI', nombre: 'Psicología', semestre: 2, requisitos: [] },
        { id: 'MP', nombre: 'Microbiología y parasitología', semestre: 2, requisitos: [] },
        { id: 'EC1', nombre: 'Enfermería comunitaria I', semestre: 2, requisitos: [] },

        // 2do Año (semestres 3 y 4)
        { id: 'EAA', nombre: 'Enfermería del adulto y el anciano', semestre: 3, requisitos: ['PSI', 'EC1'] },
        { id: 'IT', nombre: 'Inglés técnico', semestre: 3, requisitos: ['EOE'] },
        { id: 'EPI', nombre: 'Epidemiología', semestre: 3, requisitos: ['CB', 'MP', 'EC1'] },
        { id: 'ND', nombre: 'Nutrición y dietoterapia', semestre: 3, requisitos: ['CB', 'MP'] },
        { id: 'FAR', nombre: 'Farmacología', semestre: 4, requisitos: ['CB', 'EC1'] },
        { id: 'SOC1', nombre: 'Sociología I', semestre: 4, requisitos: ['PSI', 'EC1'] },
        { id: 'ESM', nombre: 'Enfermería de la salud mental', semestre: 4, requisitos: ['PSI', 'EC1', 'EPI'] },
        { id: 'IE1', nombre: 'Investigación en enfermería I', semestre: 4, requisitos: ['IT'] },
        { id: 'INF', nombre: 'Informática', semestre: 4, requisitos: ['EPI', 'IE1'] },

        // 3er Año (semestres 5 y 6)
        { id: 'EMI', nombre: 'Enfermería materno infantil', semestre: 5, requisitos: ['EAA', 'ND', 'ESM'] },
        { id: 'ANT', nombre: 'Antropología', semestre: 5, requisitos: ['SOC1', 'ESM'] },
        { id: 'EDP1', nombre: 'Ética y deontología profesional I', semestre: 5, requisitos: ['FAR', 'INF'] },
        { id: 'ENA', nombre: 'Enfermería del niño y el adolescente', semestre: 5, requisitos: ['ESM', 'EMI', 'ANT'] },
        { id: 'GSE', nombre: 'Gestión de servicios de enfermería hospitalaria y comunitarios I', semestre: 6, requisitos: ['IE1', 'INF', 'EDP1'] },
        { id: 'ELEC', nombre: 'Electiva', semestre: 6, requisitos: ['ENA', 'GSE'] },
        { id: 'PI1', nombre: 'Práctica integrada I', semestre: 6, requisitos: ['ELEC'] },
    ];
    // --- FIN DE LOS DATOS ---


    const mallaContainer = document.getElementById('malla-curricular');
    const resetButton = document.getElementById('resetButton');

    // Carga los ramos aprobados desde el almacenamiento local del navegador.
    // Si no hay nada guardado, empieza con una lista vacía.
    let ramosAprobados = JSON.parse(localStorage.getItem('ramosAprobadosEnfermeria')) || [];

    // Función para guardar el progreso en el almacenamiento local.
    const guardarProgreso = () => {
        localStorage.setItem('ramosAprobadosEnfermeria', JSON.stringify(ramosAprobados));
    };

    // Función para mostrar alertas personalizadas.
    const mostrarAlerta = (mensaje) => {
        const alerta = document.getElementById('alerta');
        const mensajeAlerta = document.getElementById('alerta-mensaje');
        
        mensajeAlerta.innerHTML = mensaje;
        alerta.classList.remove('alerta-hide');

        // Oculta la alerta después de 5 segundos.
        setTimeout(() => {
            alerta.classList.add('alerta-hide');
        }, 5000);
    };

    // Función principal que dibuja y actualiza la malla en la pantalla.
    const actualizarMalla = () => {
        mallaContainer.innerHTML = ''; // Limpia la malla antes de redibujarla.

        // Determina el número máximo de semestres para crear las columnas.
        const semestres = [...new Set(mallaData.map(r => r.semestre))].sort((a,b) => a-b);

        // Crea una columna para cada semestre.
        semestres.forEach(numSemestre => {
            const semestreDiv = document.createElement('div');
            semestreDiv.className = 'semestre';
            
            // Asigna el título correcto a cada columna.
            let tituloSemestre;
            if (numSemestre === 0) {
                tituloSemestre = 'Bimestral';
            } else {
                const ano = Math.ceil(numSemestre / 2);
                tituloSemestre = `${ano}° Año - Semestre ${numSemestre}`;
            }
            semestreDiv.innerHTML = `<h2>${tituloSemestre}</h2>`;

            // Filtra los ramos que pertenecen a este semestre.
            const ramosDelSemestre = mallaData.filter(ramo => ramo.semestre === numSemestre);

            // Crea y añade cada ramo a su columna.
            ramosDelSemestre.forEach(ramo => {
                const ramoDiv = document.createElement('div');
                ramoDiv.className = 'ramo';
                ramoDiv.dataset.id = ramo.id; // Guarda el ID del ramo en el elemento.
                ramoDiv.textContent = ramo.nombre;

                const aprobado = ramosAprobados.includes(ramo.id);
                const requisitosFaltantes = ramo.requisitos.filter(req => !ramosAprobados.includes(req));
                const bloqueado = !aprobado && requisitosFaltantes.length > 0;

                if (aprobado) {
                    ramoDiv.classList.add('aprobado');
                } else if (bloqueado) {
                    ramoDiv.classList.add('bloqueado');
                    // Guarda los requisitos faltantes para mostrarlos en la alerta.
                    ramoDiv.dataset.faltantes = requisitosFaltantes.join(', ');
                }
                
                semestreDiv.appendChild(ramoDiv);
            });

            mallaContainer.appendChild(semestreDiv);
        });
    };

    // Escucha los clics en toda la zona de la malla.
    mallaContainer.addEventListener('click', (e) => {
        // Solo reacciona si el clic fue sobre un elemento con la clase 'ramo'.
        if (!e.target.classList.contains('ramo')) return;

        const ramoDiv = e.target;
        const ramoId = ramoDiv.dataset.id;
        const ramoInfo = mallaData.find(r => r.id === ramoId);

        // Si el ramo está bloqueado, muestra una alerta con los requisitos.
        if (ramoDiv.classList.contains('bloqueado')) {
            const faltantesNombres = ramoDiv.dataset.faltantes
                .split(', ')
                .map(id => mallaData.find(r => r.id === id)?.nombre || id);
            
            mostrarAlerta(`<b>Ramo bloqueado.</b><br>Debes aprobar: <br><em>${faltantesNombres.join('<br>')}</em>`);
            return;
        }

        // Si el ramo no está bloqueado, lo aprueba o desaprueba.
        if (ramosAprobados.includes(ramoId)) {
            ramosAprobados = ramosAprobados.filter(id => id !== ramoId); // Desaprobar
        } else {
            ramosAprobados.push(ramoId); // Aprobar
        }

        guardarProgreso(); // Guarda el cambio.
        actualizarMalla(); // Vuelve a dibujar la malla con el nuevo estado.
    });

    // Funcionalidad del botón para limpiar el progreso.
    resetButton.addEventListener('click', () => {
        if (confirm('¿Estás seguro de que quieres borrar todo tu progreso? Esta acción no se puede deshacer.')) {
            ramosAprobados = [];
            guardarProgreso();
            actualizarMalla();
        }
    });

    // Dibuja la malla por primera vez al cargar la página.
    actualizarMalla();
});
