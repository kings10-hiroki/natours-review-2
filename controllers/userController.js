const multer = require('multer');
const sharp = require('sharp');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

// const multerStorage = multer.diskStorage({
//     // 保存場所
//     destination: (req, file, cb) => {
//         cb(null, 'public/img/users');
//     },
//     // ファイル名
//     filename: (req, file, cb) => {
//         // mimetype: 'image/jpeg' =>　'img'
//         const ext = file.mimetype.split('/')[1];
//         // 参照元のファイル名取得
//         // originalname: 'monica.jpg' => 'monica'
//         // const filename = file.originalname.split('.')[0];
//         cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//     }
// });

// Buffer objectsに保存する
// req.file.bufferで参照できる
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    // 指定された種類のファイル以外はエラー
    // mimetype: 'image/jpeg'
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new AppError('Not an image! Please upload only images.', 400), false);
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
    if (!req.file) return next();

    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/users/${req.file.filename}`);

    next();
});

// filterObj(req.body, 'name', 'email');
const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
}

exports.updateMe = catchAsync(async (req, res, next) => {
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('This route is not for password updates. Please use /updateMyPassword', 400));
    }

    // nameとemailのみユーザーの情報を変更できる
    const filteredBody = filterObj(req.body, 'name', 'email');
    // photo: req.file.filename
    // { filename: 'user-5c8a1dfa2f8fb814b56fa181-monica-1605147403773.jpeg' }
    if (req.file) filteredBody.photo = req.file.filename;

    const updateUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        status: 'success',
        data: {
            user: updateUser
        }
    });
});

exports.deleteMe = catchAsync(async (req, res) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
        status: 'success',
        data: null
    });
});

exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
};

exports.getAllUsers = factory.getAll(User);
exports.createUser = factory.createOne(User);
exports.getUser = factory.getOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);

