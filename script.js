
document.addEventListener('DOMContentLoaded', () => {

    // --- CONFIGURACIÓN DE LA MALLA ---
    // Modifica esta sección con los datos de tu carrera.
    // id: Un código único para el ramo.
    // nombre: El nombre completo que se mostrará.
    // semestre: El número del semestre al que pertenece.
    // requisitos: Un array con los 'id' de los ramos que necesita. Si no tiene, déjalo vacío [].
    const mallaData = [
        { id: 'CAL1', nombre: 'Cálculo I', semestre: 1, requisitos: [] },
        { id: 'ALG1', nombre: 'Álgebra I', semestre: 1, requisitos: [] },
        { id: 'FIS1', nombre: 'Física I', semestre: 1, requisitos: [] },
        { id: 'PROG1', nombre: 'Programación I', semestre: 1, requisitos: [] },

        { id: 'CAL2', nombre: 'Cálculo II', semestre: 2, requisitos: ['CAL1'] },
        { id: 'ALG2', nombre: 'Álgebra II', semestre: 2, requisitos: ['ALG1'] },
        { id: 'FIS2', nombre: 'Física II', semestre: 2, requisitos: ['FIS1', 'CAL1'] },
        { id: 'PROG2', nombre: 'Programación II', semestre: 2, requisitos: ['PROG1'] },

        { id: 'CAL3', nombre: 'Cálculo III', semestre: 3, requisitos: ['CAL2'] },
        { id: 'EDO', nombre: 'Ecuaciones Diferenciales', semestre: 3, requisitos: ['CAL2'] },
        { id: 'ESTRUC', nombre: 'Estructura de Datos', semestre: 3, requisitos: ['PROG2'] },
        { id: 'CIR', nombre: 'Circuitos Eléctricos', semestre: 3, requisitos: ['FIS2'] },
        
        { id: 'PROBA', nombre: 'Probabilidades', semestre: 4, requisitos: ['CAL3'] },
        { id: 'BD', nombre: 'Bases de Datos', semestre: 4, requisitos: ['ESTRUC'] },
        { id: 'ARQ', nombre: 'Arquitectura de Computadores', semestre: 4, requisitos: ['CIR'] },

        // Agrega aquí el resto de tus ramos...
    ];
    // --- FIN DE LA CONFIGURACIÓN ---


    const mallaContainer = document.getElementById('malla-curricular');
    const resetButton = document.getElementById('resetButton');

    // Cargar ramos aprobados desde localStorage o inicializar un array vacío
    let ramosAprobados = JSON.parse(localStorage.getItem('ramosAprobados')) || [];

    // Función para guardar el estado en localStorage
    const guardarProgreso = () => {
        localStorage.setItem('ramosAprobados', JSON.stringify(ramosAprobados));
    };

    // Función para mostrar alertas
    const mostrarAlerta = (mensaje) => {
        const alerta = document.getElementById('alerta');
        const mensajeAlerta = document.getElementById('alerta-mensaje');
        
        mensajeAlerta.innerHTML = mensaje;
        alerta.classList.remove('alerta-hide');

        setTimeout(() => {
            alerta.classList.add('alerta-hide');
        }, 4000); // La alerta desaparece después de 4 segundos
    };

    // Función principal para renderizar y actualizar la malla
    const actualizarMalla = () => {
        // Limpiar contenedor
        mallaContainer.innerHTML = '';

        const maxSemestre = Math.max(...mallaData.map(r => r.semestre));

        // Crear columnas de semestres
        for (let i = 1; i <= maxSemestre; i++) {
            const semestreDiv = document.createElement('div');
            semestreDiv.className = 'semestre';
            semestreDiv.innerHTML = `<h2>Semestre ${i}</h2>`;
            mallaContainer.appendChild(semestreDiv);
        }

        // Añadir ramos a sus respectivos semestres
        mallaData.forEach(ramo => {
            const ramoDiv = document.createElement('div');
            ramoDiv.className = 'ramo';
            ramoDiv.dataset.id = ramo.id;
            ramoDiv.textContent = ramo.nombre;

            // Verificar requisitos
            const requisitosFaltantes = ramo.requisitos.filter(req => !ramosAprobados.includes(req));
            const aprobado = ramosAprobados.includes(ramo.id);
            const bloqueado = requisitosFaltantes.length > 0;

            if (aprobado) {
                ramoDiv.classList.add('aprobado');
            } else if (bloqueado) {
                ramoDiv.classList.add('bloqueado');
                ramoDiv.dataset.faltantes = requisitosFaltantes.join(', ');
            }

            const semestreColumn = mallaContainer.children[ramo.semestre - 1];
            if (semestreColumn) {
                semestreColumn.appendChild(ramoDiv);
            }
        });
    };

    // Manejador de clics en la malla (delegación de eventos)
    mallaContainer.addEventListener('click', (e) => {
        if (!e.target.classList.contains('ramo')) return;

        const ramoDiv = e.target;
        const ramoId = ramoDiv.dataset.id;

        if (ramoDiv.classList.contains('bloqueado')) {
            const faltantes = ramoDiv.dataset.faltantes.split(', ').map(id => mallaData.find(r => r.id === id)?.nombre || id);
            mostrarAlerta(`<b>Ramo bloqueado.</b><br>Necesitas aprobar: ${faltantes.join(', ')}.`);
            return;
        }

        // Aprobar o desaprobar un ramo
        if (ramosAprobados.includes(ramoId)) {
            // Desaprobar (quitar del array)
            ramosAprobados = ramosAprobados.filter(id => id !== ramoId);
        } else {
            // Aprobar (agregar al array)
            ramosAprobados.push(ramoId);
        }

        guardarProgreso();
        actualizarMalla();
    });

    // Botón para limpiar el progreso
    resetButton.addEventListener('click', () => {
        if (confirm('¿Estás seguro de que quieres borrar todo tu progreso? Esta acción no se puede deshacer.')) {
            ramosAprobados = [];
            guardarProgreso();
            actualizarMalla();
        }
    });

    // Renderizado inicial de la malla
    actualizarMalla();
});
