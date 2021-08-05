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
        let user = await User.findOne({ email })
            .then(user => {
                if (!user) return res.status(400).json({ error: 'Usuário não Cadastrado' })
                bcrypt.compare(password, user.password, (error, data) => {
                    if (error) return res.status(400).json({ error: 'Erro de API' })
                    if (data) {
                        return res.status(200).json({
                            msg: 'Logado com Sucesso',
                            id: user._id
                        })
                    } else {
                        return res.status(401).json({ msg: 'Login Inválido' })
                    }
                })
            })
    }

    async update(req, res) {
        const schema = yup.object().shape({
            firstName: yup.string().required(),
            lastName: yup.string().required(),
            email: yup.string().required(),
            password: yup.string().required()
        });
        const { firstName, lastName, email, password } = req.body;
        const { user_id } = req.params;
        const user = await User.findById(user_id);
        let dbEmails = await User.findOne({ email })

        if (dbEmails) {
            return res.status(400).json({ msg: 'E-mail ja Cadastrado' })
        }

        if (!user) {
            return res.status(400).json({ error: 'Usuário não logado' })
        }

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Falha na validação' });
        }
        await User.updateOne({ _id: user_id }, {
            firstName,
            lastName,
            email,
            password
        })
        return res.json({ msg: 'Usuário Editado com Sucesso' })
    }
}

export default new SessionController();