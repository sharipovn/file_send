import React,{useState} from 'react'
import HoverCard from '../components/HoverCard';

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('uz-UZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  

function TableRow({page_type,file,index}) {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    const [showModal, setShowModal] = useState(false);

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);
    
    const truncateFileName = (text) => {
        const maxLength =25; // Number of characters to show before '...'
        if (text.length > maxLength + 5) { // Ensure there are enough characters to show
          const start = text.substring(0, maxLength); // First 30 characters
          const end = text.substring(text.length - 5); // Last 4 characters
          return `${start}  ...  ${end}`;
        }
        return text;
      };


    const truncateComment = (text) => {
        if (!text) {
            return 'no comment';
        }
        return text.length > 50 ? text.substring(0, 50) + ' ...' : text;
    };


  return (
    <tr key={file.file_id}>
        <td className="custom-cell">{index + 1}</td>
        {page_type === 'all' && (<td className="custom-cell">{file.sender.username}</td>)}
        <td className="custom-cell" title={file.file_name}>
            <a href={file.file_url}  download={file.file_name} className='text-light'   style={{ textDecoration: 'none' }} >
                {truncateFileName(file.file_name)} 
            </a>
        </td>
        <td className={`custom-cell ${!file.comment ? 'text-warning' : 'text-dark'}`} title={file.comment}>{truncateComment(file.comment)}</td>
        <td className="custom-cell">
        {formatDate(file.created)}
        </td>
        <td className="custom-cell">{file.file_size}</td>
        <td className="custom-cell">
                <i style={{ color: 'blue', cursor: 'pointer' }} className="fa-2x fa-regular fa-eye" onClick={handleShow}></i>
                <HoverCard who_can_see={file.who_can_see} show={showModal} handleClose={handleClose} />
        </td>
        <td className="custom-cell">
        {userInfo.id === file.sender.id && (
            <img src="/icons/delete-file.png" alt="icon" style={{ width: '40px', height: '40px' }} />
          )}
        </td>
    </tr>
  )
}

export default TableRow