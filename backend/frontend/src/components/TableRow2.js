import React, { useState } from 'react';
import axios from 'axios';
import HoverCard from './HoverCard';

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

function TableRow({ page_type, file, index, onFileDeleted }) {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const [showModal, setShowModal] = useState(false);

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    const truncateFileName = (text) => {
        const maxLength = 25;
        if (text.length > maxLength + 5) {
            const start = text.substring(0, maxLength);
            const end = text.substring(text.length - 5);
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

    const handleDelete = async () => {
        try {
            await axios.delete(`/api/delete_file/${file.file_id}/`, {
                headers: {
                    'Authorization': `Bearer ${userInfo.access}`,
                },
            });
            if (onFileDeleted) {
                onFileDeleted(file.file_id); // Notify parent component
            }
        } catch (error) {
            console.error('Failed to delete file:', error);
        }
    };

    return (
        <tr key={file.file_id}>
            <td className="custom-cell">{index + 1}</td>
            {page_type === 'all' && (<td className="custom-cell">{file.sender.username}</td>)}
            <td className="custom-cell" title={file.file_name}>
                <a href={file.file_url} download={file.file_name} className='text-light' style={{ textDecoration: 'none' }}>
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
                    <img
                        src="/icons/delete-file.png"
                        alt="Delete icon"
                        style={{ width: '40px', height: '40px', cursor: 'pointer' }}
                        onClick={handleDelete}
                    />
                )}
            </td>
        </tr>
    );
}

export default TableRow;
