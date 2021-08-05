import User from '../models/User';
import * as yup from 'yup';
import bcrypt from 'bcrypt';

class SessionController {
    async store(req, res) {
        const schema = yup.object().shape({
            firstName: yup.string().required(),
            lastName: yup.string().required(),
            email: yup.string().required(),
            password: yup.string().required()
        })
        const { firstName, lastName, email } = req.body;
        let password = await bcrypt.hash(req.body.password, 10);
        let user = await User.findOne({ email });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Falha na Verificação' });
        }

        if (!user) {
            user = await User.create({
                firstName,
                lastName,
                email,
                password
            });
        } else {
            return res.status(400).json({ error: 'Usuário já Cadastrado' })
        }
        return res.json({ user });
    }

    async index(req, res) {
        const { email, password } = req.body;
        let user = await User.findOne({ email, password });
        if (!user) {
            return res.status(400).json({ error: 'Usuário não existe' });
        }
        return res.json(user);
    }
}

export default new SessionController();