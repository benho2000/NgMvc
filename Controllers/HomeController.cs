using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Mvc;
using Mvc6.Model;


namespace Mvc6.Controllers
{
    public class HomeController : Controller
    {
        private List<Car> GetCars()
        {
            List<string> makeList = new List<string>() { "Honda", "Toyota", "Ford", "Lexus", "Mazada", "Kia", "Jeep" };
            List<string> yearList = new List<string>() { "1991", "1992", "1993", "1994", "1995", "1996", "1997", "1998", "1999", "2000" };

            List<Car> cars = new List<Car>();

            for(int i = 1; i< 10000; i++)
            {
                Random rnd = new Random();
                Car car = new Car();
                car.Id = i;
                car.Make = makeList[rnd.Next(makeList.Count)];
                car.Year = yearList[rnd.Next(yearList.Count)];
                cars.Add(car);
            }

            return cars;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        [Route("/api/cars")]
        public List<Car> Get()
        {
            return GetCars();
        }

        public IActionResult Serverside()
        {
            return View();
        }

        public IActionResult Contact()
        {
            ViewData["Message"] = "Your contact page.";

            return View();
        }

        public IActionResult Error()
        {
            return View();
        }
    }
}
