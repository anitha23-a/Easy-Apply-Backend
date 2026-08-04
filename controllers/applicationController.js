import Application from '../models/Application.js';

// @desc    Submit a new service application
// @route   POST /api/applications
// @access  Public
export const createApplication = async (req, res, next) => {
  // When using multipart/form-data, multer places uploaded files in req.files
  // and other fields as strings in req.body. Expect `formData` to be a
  // JSON-stringified payload in req.body.formData.
  try {
    const serviceType = req.body.serviceType;
    const phone = req.body.phone;

    let formData = req.body.formData;
    if (typeof formData === 'string') {
      try {
        formData = JSON.parse(formData);
      } catch (err) {
        formData = {};
      }
    }

    // Attach uploaded file paths (if any) into formData.uploads
    formData.uploads = formData.uploads || {};
    if (req.files) {
      Object.keys(req.files).forEach((key) => {
        const arr = req.files[key];
        if (arr && arr.length > 0) {
          formData.uploads[key] = arr.map((f) => ({ filename: f.filename, path: f.path }));
        }
      });
    }

    // Extract NIC from formData (checking common keys)
    const nic = formData?.nic || formData?.NIC || formData?.nationalId;

    if (!nic) {
      res.status(400);
      return next(new Error('Identification (NIC / Passport / BR Number) is required'));
    }

    // Extract phone from top-level body, formData, or mobileNumber
    const verifiedPhone = phone || formData?.phone || formData?.mobileNumber;

    if (!verifiedPhone) {
      res.status(400);
      return next(new Error('Verified phone number is required'));
    }

    // Service-specific validations
    if (serviceType === 'relocation') {
      const addrPresent = Boolean(
        formData?.address1 || formData?.newAddress || formData?.newAddressLine1 || formData?.addressLine1 || formData?.district
      );

      if (!addrPresent) {
        res.status(400);
        return next(new Error('New service address is required for relocation'));
      }

      // Ensure proofOfAddress file was uploaded
      const proofFiles = formData.uploads?.proofOfAddress || req.files?.proofOfAddress;
      if (!proofFiles || (Array.isArray(proofFiles) && proofFiles.length === 0)) {
        res.status(400);
        return next(new Error('Proof of address document is required for relocation'));
      }

      // Conditional validation: nearest SLT numbers required for FTTH/Megaline
      const selectedServiceType = (formData?.serviceType || formData?.selectedServiceType || '').toString().toLowerCase();
      if (['ftth', 'megaline'].includes(selectedServiceType)) {
        const s1 = formData?.sltNumber1 || formData?.nearestSlt1;
        const s2 = formData?.sltNumber2 || formData?.nearestSlt2;
        const validPhone = (v) => typeof v === 'string' && /^\d{10}$/.test(v.replace(/\D/g, ''));
        if (!validPhone(s1) || !validPhone(s2)) {
          res.status(400);
          return next(new Error('Two nearest SLT telephone numbers are required for FTTH/Megaline services and must be 10 digits'));
        }
      }
    }

    const application = await Application.create({
      phone: verifiedPhone,
      serviceType,
      formData,
      nic,
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      application: {
        id: application._id,
        referenceNumber: application.referenceNumber,
        serviceType: application.serviceType,
        status: application.status,
        nic: application.nic,
        createdAt: application.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Public status check using reference number
// @route   GET /api/applications/check-status
// @access  Public
export const checkApplicationStatus = async (req, res, next) => {
  const { ref } = req.query;

  try {
    // Perform search solely by reference number
    const application = await Application.findOne({
      referenceNumber: ref,
    });

    if (!application) {
      res.status(404);
      return next(new Error('No application found with this reference number. Please check and try again.'));
    }

    res.status(200).json({
      success: true,
      referenceNumber: application.referenceNumber,
      status: application.status,
      serviceType: application.serviceType,
      createdAt: application.createdAt,
    });
  } catch (error) {
    next(error);
  }
};
