const Company = require('../../db/models/company')
const fs = require('fs')

class CompanyController{
    async showCompanies(req,res){
        //Można krok po kroku wysłać JSON
        // res.header('Content-Type', 'application/json')
        // res.send(JSON.stringify({ text: 'wartoscZSTRINGYFYJSONHEHE'}))

        //Można zrobić to w jednej linii
        const companies = await Company.find()
        res.status(200).json(companies)
    }

    async create(req, res) {
        const company = new Company({
            slug: req.body.slug,
            name: req.body.name,
            employeesCount: req.body.employeesCount || undefined,
            user:  req.user._id
          
        })
        try{
            await company.save();
            res.status(201).json(company)
        } catch(err) {
           res.status(422).json({ errors: err.errors})
        }
    }

    async edit(req, res) {
        const {slug} = req.params
        const company = await Company.findOne({ slug : slug })
        if(req.body.name) company.name = req.body.name
        if(req.body.slug) company.slug = req.body.slug
        if(req.body.employeesCount) company.employeesCount = req.body.employeesCount
        if(req.file.filename && company.image){
            fs.unlinkSync('public/uploads/'+company.image)
        }
        if(req.file.filename){
            company.image = req.file.filename
        }
        

        try{
            await company.save()
            res.status(200).json(company)
        } catch(err) {
            res.status(422).json({ errors: err.errors})
        }
    }

    async delete(req, res) {
        const {slug} = req.params
        const company = await Company.findOne({ slug: slug })
        try{
            if(company.image){
                fs.unlinkSync('public/uploads/'+company.image)
            }
            await company.deleteOne()
            res.sendStatus(204); 
        } catch(err) {
            res.sendStatus(404);
        }  
    }

}

module.exports = new CompanyController()