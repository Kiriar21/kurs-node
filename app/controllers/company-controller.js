const Company = require('../db/models/company')
const fs = require('fs');
const { Parser } = require('json2csv')

class CompanyController{
    async showCompanies(req,res){
        const {q, sort, countmin, countmax } = req.query;
        
        
        const page= req.query.page || 1;
        const perPage= 2;


        //Pudełko na wszystkie wartości do query
        const where= {};
        //Search
        if(q) where.name = { $regex: q, $options: 'i'};
        //Filtrowanie
        if(countmin||countmax) {
            where.employeesCount = {};
            if(countmin) where.employeesCount.$gte=countmin;
            if(countmax) where.employeesCount.$lte=countmax;
        }

        //Dodanie do query wartosci do filtru i szukania
        let query = Company.find(where);

        //paginacja
        query = query.skip((page-1)*perPage);
        query = query.limit(perPage);

        //Dodanie sortowania do query
        if (sort) {
            let s = sort.split('|');
            query = query.sort({ [s[0]]: [s[1]]})
        } else {
            query = query.sort({ name: 'DESC' })
        }

        //Wykonanie query 
        const companies = await query.populate('user').exec(); 
        const resultsCount = await Company.find(where).countDocuments(); 
        const pagesCount = Math.ceil(resultsCount / perPage);
        
        res.render('pages/companies/companies', {
            companies,
            title: 'Lista Firm',
            page,
            pagesCount,
            resultsCount,
         });
    }
    
    async showCompany(req, res) {
    const { name } = req.params;
    const company = await Company.findOne({slug: name}) ?? ' ';
    res.render('pages/companies/company', { 
        name: company?.name,
        slug: company?.slug,
        title: company?.name ?? 'Brak firmy',
    });
    }

    showCreateCompanyForm(req, res) {
        res.render('pages/companies/create')
    }

    async createCompany(req,res) {
        const company = new Company({
            slug: req.body.slug,
            name: req.body.name,
            employeesCount: req.body.employeesCount || undefined,
            user: req.session.user._id,
            image: req.file?.filename || "",           
        })
        try{
            await company.save();
            res.redirect('/firmy');
        } catch(err) {
            res.render('pages/companies/create',{
                errors: err.errors,
                form: req.body  
            });
            console.log(err);
        }
    }

    async showEditCompanyForm(req, res) {
        const {name} = req.params;
        const company = await Company.findOne({ slug : name }); 
        if(company){
            res.render('pages/companies/edit', {
                form: company,
            })
        } else {
            res.redirect('/views/errors/404');
        }
        
    }

    async editCompany(req,res) {
        const {name} = req.params
        const company = await Company.findOne({ slug : name })
        company.name = req.body.name
        company.slug = req.body.slug
        company.employeesCount = req.body.employeesCount
        if(req.file?.filename && company.image){
            fs.unlinkSync('public/uploads/'+company.image)
        }
        if(req.file?.filename){
            company.image = req.file.filename
        }
        

        try{
            await company.save()
            res.redirect('/firmy')
        } catch(err) {
            res.render('pages/companies/edit',{
                errors: err.errors,
                form: req.body  
            });
            
        }
    }

    async deleteCompany(req,res) {
        const {name} = req.params
        const company = await Company.findOne({ slug: name })
        try{
            if(company.image){
                fs.unlinkSync('public/uploads/'+company.image)
            }
            await company.deleteOne()
            res.redirect('/firmy')
        } catch(err) {
            res.redirect('/views/errors/404')
        }
    }

    async deleteImage(req, res){
        const {name} = req.params
        const company = await Company.findOne({ slug: name })
        try{
            fs.unlinkSync('public/uploads/'+company.image)
            company.image = '';
            await company.save();
            res.redirect('/firmy');
        } catch(err) {
            res.redirect('/views/errors/404');   
        }
    }

    async getCSV(req,res) {
        const fields = [
            {
                label: 'Nazwa',
                value: 'name'
            },
            {
                label: 'URL',
                value: 'slug'
            },
            {
                label: 'Liczba pracownikow',
                value: 'employeesCount'
            }
        ]

        const data = await Company.find()
        const fileName = 'companies.csv'

        const json2csv = new Parser({ fields, withBOM: true, excelStrings: true})
        const csv = json2csv.parse(data)
        res.header('Content-Type', 'text/csv')
        res.attachment(fileName) 
        res.send(csv)
    }
}
//Musze eksportowac nowa instancje kontrolera zeby zadziałało pobieranie w pliku
module.exports = new CompanyController()