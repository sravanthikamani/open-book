import multer from 'multer';
import xlsx from 'xlsx';
import { Contact } from '../../../models';

const upload = multer({ dest: 'uploads/' });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default upload.single('file'); async (req, res) => {
  const workbook = xlsx.readFile(req.file.path);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(sheet);

  for (const contact of data) {
    await Contact.create(contact);
  }

  return res.status(200).json({ message: 'Contacts uploaded successfully' });
};
