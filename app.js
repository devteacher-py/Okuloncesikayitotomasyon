
const firebaseConfig = {
    /*Your config here*/
  };
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  const studentForm = document.getElementById('studentForm');

studentForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const surname = document.getElementById('surname').value;
    const birthdate = document.getElementById('birthdate').value;
    const parentName = document.getElementById('parentName').value;
    const contact = document.getElementById('contact').value;

    db.collection("students").add({
        name: name,
        surname: surname,
        birthdate: birthdate,
        parentName: parentName,
        contact: contact
    }).then(() => {
        alert('Öğrenci kaydedildi!');
        studentForm.reset();
        displayStudents();
    }).catch((error) => {
        console.error("Error adding document: ", error);
    });
});
function displayStudents() {
    const studentsTable = document.querySelector('#studentsTable tbody');
    studentsTable.innerHTML = ''; // Tablodaki mevcut satırları temizle

    db.collection("students").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const student = doc.data();

            // Her öğrenci için tabloya yeni bir satır ekle
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.name}</td>
                <td>${student.surname}</td>
                <td>${student.birthdate}</td>
                <td>${student.parentName}</td>
                <td>${student.contact}</td>
                <td>
                    <button onclick="editStudent('${doc.id}', '${student.name}', '${student.surname}', '${student.birthdate}', '${student.parentName}', '${student.contact}')">Düzenle</button>
                    <button onclick="deleteStudent('${doc.id}')">Sil</button>
                </td>
            `;
            studentsTable.appendChild(row);
        });
    });
}

displayStudents();
function deleteStudent(id) {
    db.collection("students").doc(id).delete().then(() => {
        alert('Öğrenci kaydı silindi!');
        displayStudents(); // Öğrenci listesini güncelle
    }).catch((error) => {
        console.error("Error removing document: ", error);
    });
}
function editStudent(id, name, surname, birthdate, parentName, contact) {
    document.getElementById('name').value = name;
    document.getElementById('surname').value = surname;
    document.getElementById('birthdate').value = birthdate;
    document.getElementById('parentName').value = parentName;
    document.getElementById('contact').value = contact;

    studentForm.removeEventListener('submit', addStudent); // Yeni öğrenci ekleme fonksiyonunu kaldır
    studentForm.addEventListener('submit', (e) => {
        e.preventDefault();

        db.collection("students").doc(id).update({
            name: document.getElementById('name').value,
            surname: document.getElementById('surname').value,
            birthdate: document.getElementById('birthdate').value,
            parentName: document.getElementById('parentName').value,
            contact: document.getElementById('contact').value
        }).then(() => {
            alert('Öğrenci kaydı güncellendi!');
            studentForm.reset(); // Formu temizle
            displayStudents(); // Öğrenci listesini güncelle
        });
    });
}

  