import express from 'express';
import { getRepository } from 'typeorm';
import { Controller } from 'Src/interfaces/controller.interface';
import { Address } from './address.entity';

export class AddressController implements Controller {
	public path = '/addresses';
	public router = express.Router();
	private addressRepository = getRepository(Address);

	public constructor() {
		this.initializeRoutes();
	}

	private initializeRoutes(): void {
		this.router.get(this.path, this.getAllAddresses);
	}

	private getAllAddresses = async (
		request: express.Request,
		response: express.Response,
	): Promise<void> => {
		const addresses = await this.addressRepository.find();
		response.send(addresses);
	};
}
