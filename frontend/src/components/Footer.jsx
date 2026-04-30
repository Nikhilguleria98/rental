import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-lg font-semibold">RentalStay</h3>
            <p className="mt-4 text-sm text-slate-300">Find your perfect stay with comfort, convenience, and exceptional service.</p>
          </div>
          <div>
            <h4 className="font-semibold">Quick Links</h4>
            <ul className="mt-4 space-y-2 text-sm text-slate-300">
              <li><Link to="/" className="hover:text-cyan-400">Home</Link></li>
              <li><Link to="/nearby" className="hover:text-cyan-400">Nearby Attractions</Link></li>
              <li><Link to="/contact" className="hover:text-cyan-400">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold">Support</h4>
            <ul className="mt-4 space-y-2 text-sm text-slate-300">
              <li><a href="#" className="hover:text-cyan-400">Help Center</a></li>
              <li><a href="#" className="hover:text-cyan-400">Booking Terms</a></li>
              <li><a href="#" className="hover:text-cyan-400">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold">Contact Info</h4>
            <ul className="mt-4 space-y-2 text-sm text-slate-300">
              <li>Phone: +1 555 840 1290</li>
              <li>Email: hello@rentalstay.com</li>
              <li>Address: 312 Harbor View Avenue, Miami, FL</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-slate-700 pt-8 text-center text-sm text-slate-400">
          <p>&copy; 2024 RentalStay. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;