import React, {useState, useEffect} from 'react'
import axios from 'axios'
import CloseIcon from "../imgs/crosses.png" 
import "./UseCrud.css"
import Button from "../UI/Button"
import EditUserIcon from "../imgs/editar (1).png"
import DeleteUserIcon from "../imgs/borrar.png"

export default function UseCrud() {
  const [files, setFiles] = useState([]);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState();
  const [editMode, setEditMode] = useState(false);
  const [fileId, setFileId] = useState(null);
  const [hide, setHide] = useState("hide");

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/pdfapi/file/');
      setFiles(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const addFile = async (file, fileName) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('filename', fileName);

    try {
      const response = await axios.post('http://127.0.0.1:8000/pdfapi/file/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
      fetchFiles();
    } catch (error) {
      console.log(error);
    }
  };

  const modifyFile = async (id, file, fileName) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('filename', fileName);

    try {
      const response = await axios.put(`http://127.0.0.1:8000/pdfapi/file/${id}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
      fetchFiles();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteFile = async (id) => {
    try {
      const response = await axios.delete(`http://127.0.0.1:8000/pdfapi/file/${id}/`);
      fetchFiles();
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeFileName = (event) => setFileName(event.target.value)
  const handleChangeFile = (event) => setFile(event.target.files[0]);

  const handleEdit = (file) => {
    setFileId(file.id);
    setFileName(file.fileName);
    setFile(null);
    setEditMode(true);
    setHide("show");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (editMode) {
      await modifyFile(fileId, file, fileName);
    } else {
      await addFile(file, fileName);
    }

    setFile(null);
    setFileName("");
    setEditMode(false);
    setHide("hide");
  };

  const handleCloseButton = (event) => {
    event.preventDefault();
    setHide("hide");
    setEditMode(false);
    setFile(null);
    setFileName("");
  };

  const handleShowForm = (event) => {
    event.preventDefault();
    setHide("show");
  };

  const handleDeleteFile = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este archivo?')) {
      deleteFile(id);
    }
  };

  function formatDateTime(dateTimeString) {
    const date = new Date(dateTimeString);
    
    const optionsDate = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const optionsTime = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
  
    const formattedDate = date.toLocaleDateString(undefined, optionsDate);
    const formattedTime = date.toLocaleTimeString(undefined, optionsTime);
  
    return `${formattedDate} ${formattedTime}`;
  }

  return (
    <div className='container'>
      <div className='add-button-container'>
        <Button onClickHandler={handleShowForm} className="float-end" content="Agregar archivo" />
      </div>
      <div className='center-modal'>
        <div className={`modal-add-user mt-3 modal-styles p-4 ${hide}`}>
          <img src={CloseIcon} className='close-icon' onClick={handleCloseButton} />
          <h2 className='text-center mb-4 fw-bold title-modal-section'> {editMode ? "Editar archivo" : "Añadir archivo"}</h2>
          <form onSubmit={handleSubmit} >
            <div className="row mb-1">
              <div className="col">
                <div data-mdb-input-init className="form-outline mb-2">
                  <input type='file' name='file' onChange={handleChangeFile} required className="form-control" placeholder='Archivo' />
                </div>
              </div>
              <div className="col">
                <div data-mdb-input-init className="form-outline mb-2">
                  <input type='text' name='filename' value={fileName} onChange={handleChangeFileName} required className="form-control" placeholder='Nombre del archivo' />
                </div>
              </div>
            </div>
            <div className='button-container mt-4'>
              <Button onClickHandler={null} className=" w-100 " content={editMode ? "Actualizar" : "Añadir archivo"} />
            </div>
          </form>
        </div>
      </div>
      <div className='container mt-5 container-table'>
        <table className="table table-hover text-center table-light">
          <thead >
            <tr>
              <th scope="col" className="fw-bold">#</th>
              <th scope="col" className="fw-bold">Nombre del archivo</th>
              <th scope="col" className="fw-bold">Ruta del archivo</th>
              <th scope="col" className="fw-bold">Fecha / Hora</th>
              <th scope="col" className="fw-bold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => (
              <tr key={file.id}>
                <td className="fw-light">{file.id}</td>
                <td className="fw-light">{file.filename}</td>
                <td className="fw-light">{file.file}</td>
                <td className="fw-light">{formatDateTime(file.upload_date)}</td>
                <td className="fw-light">
                  <a onClick={() => handleDeleteFile(file.id)}>
                    <img src={DeleteUserIcon} className='icon mx-2' />
                  </a>
                  <a onClick={() => handleEdit(file)}>
                    <img src={EditUserIcon} className='icon mx-2' />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {files.length === 0 ? (<p className="text-center mt-5">Nada que mostrar...</p>) : null}
      </div>
    </div>
  )
}