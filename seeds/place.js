const mongoose = require('mongoose');
const Place = require('../models/place');
const { geometry } = require('../utils/hereMaps');

mongoose.connect('mongodb://127.0.0.1/bestpoint')
    .then((result) => {
        console.log('connected to mongodb')
    }).catch((err) => {
        console.log(err)
    });

async function seedPlaces() {
    const places = [
        {
            title: 'Taman Mini Indonesia Indah',
            price: 'Rp 20.000',
            description: 'Taman hiburan keluarga dengan berbagai replika bangunan dari seluruh Indonesia',
            location: 'Taman Mini Indonesia Indah, Jakarta'
        },
        {
            title: 'Pantai Kuta',
            price: 'Gratis',
            description: 'Pantai yang terkenal di Bali dengan pemandangan sunset yang indah',
            location: 'Pantai Kuta, Kuta, Badung Regency, Bali'
        },
        {
            title: 'Malioboro',
            price: 'Gratis',
            description: 'Jalan utama di Yogyakarta dengan berbagai toko dan kuliner khas',
            location: 'Jl. Malioboro, Yogyakarta City, Special Region of Yogyakarta'
        },
        {
            title: 'Pantai Tanjung Aan',
            price: 'Rp 10.000',
            description: 'Pantai dengan pasir berwarna putih dan air laut yang jernih di Lombok, Nusa Tenggara Barat',
            location: 'Pantai Tanjung Aan, Lombok, West Nusa Tenggara'
        },
        {
            title: 'Bukit Bintang',
            price: 'Gratis',
            description: 'Kawasan perbelanjaan dan hiburan di Kuala Lumpur, Malaysia',
            location: 'Bukit Bintang, Kuala Lumpur, Federal Territory of Kuala Lumpur, Malaysia'
        },
        {
            title: 'Candi Prambanan',
            price: 'Rp 25.000',
            description: 'Candi Hindu terbesar di Indonesia yang terletak di Yogyakarta',
            location: 'Candi Prambanan, Sleman, Special Region of Yogyakarta'
        },
        {
            title: 'Danau Toba',
            price: 'Gratis',
            description: 'Danau vulkanik terbesar di Indonesia yang terletak di Sumatera Utara',
            location: 'Danau Toba, North Sumatra'
        },
        {
            title: 'Kawah Ijen',
            price: 'Rp 100.000',
            description: 'Kawah vulkanik dengan fenomena blue fire di Banyuwangi, Jawa Timur',
            location: 'Kawah Ijen, Banyuwangi, East Java'
        },
        {
            title: 'Pantai Sanur',
            price: 'Gratis',
            description: 'Pantai di Bali yang cocok untuk berenang dan melihat matahari terbit',
            location: 'Pantai Sanur, Denpasar, Bali'
        },

        {
            title: 'Candi Borobudur',
            price: 'Rp 25.000',
            description: 'Candi Buddha terbesar di dunia yang terletak di Magelang, Jawa Tengah',
            location: 'Candi Borobudur, Borobudur, Magelang, Central Java'
        },
        {
            title: 'Taman Nasional Gunung Rinjani',
            price: 'Rp 150.000',
            description: 'Taman nasional yang terletak di Lombok dan memiliki gunung tertinggi kedua di Indonesia',
            location: 'Taman Nasional Gunung Rinjani, Lombok, West Nusa Tenggara'
        },
        {
            title: 'Bukit Tinggi',
            price: 'Gratis',
            description: 'Kota kecil yang terletak di Sumatera Barat dengan arsitektur khas Eropa',
            location: 'Bukit Tinggi, West Sumatra'
        },
        {
            title: 'Pulau Weh',
            price: 'Rp 50.000',
            description: 'Pulau yang terletak di ujung barat Indonesia dengan keindahan bawah laut yang luar biasa',
            location: 'Pulau Weh, Sabang, Aceh'
        },
        {
            title: 'Pulau Lombok',
            price: 'Gratis',
            description: 'Pulau di Indonesia yang terkenal dengan keindahan pantainya',
            location: 'Pulau Lombok, West Nusa Tenggara'
        },
        {
            title: 'Tanjung Lesung',
            price: 'Rp 100.000',
            description: 'Kawasan wisata pantai di Banten yang cocok untuk bersantai dan berenang',
            location: 'Tanjung Lesung, Pandeglang, Banten'
        }
    ]

    try {
        const newPlace = await Promise.all(places.map( async place =>{
            let geoData = await geometry(place.location)
            return { 
                ...place, 
                author: "65e808de6bb1b850cf98fcb4",
                geometry: geoData
            }
        }))
        await Place.deleteMany({});
        await Place.insertMany(newPlace);
        console.log('Data berhasil disimpan');
    } catch (err) {
        console.log('Terjadi kesalahan saat menyimpan data:', err);
    } finally {
        mongoose.disconnect();
    }
}

seedPlaces();