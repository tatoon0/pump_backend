import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';

// Mock for UserRepository
const mockUserRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
};
  
// Mock for UserCoinRepository
const mockUserCoinRepository = {
    find: jest.fn(),
};
  
// Mock for CoinRepository
const mockCoinRepository = {
    find: jest.fn(),
    save: jest.fn(),
};

describe('UserService', () => {
    let service: UserService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                { provide: 'UsersRepository', useValue: mockUserRepository },
                { provide: 'UserCoinRepository', useValue: mockUserCoinRepository },
                { provide: 'CoinsRepository', useValue: mockCoinRepository },
            ],
        }).compile();

        service = module.get<UserService>(UserService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should return all users', async () => {
        const users = [{ id: 1, name: 'Test User', wallet_address: 'Test Address' }];
        mockUserRepository.find.mockReturnValue(users);

        expect(await service.findAll()).toBe(users);
    });

    it('should return a user', async () => {
        const user = { id: 1, name: 'Test User', wallet_address: 'Test Address' };
        mockUserRepository.findOne.mockReturnValue(user);

        expect(await service.findOne(1)).toBe(user);
    });

    it('should create a user', async () => {
        const user = { id: 1, name: 'Test User', wallet_address: 'Test Address' };
        mockUserRepository.create.mockReturnValue(user);
        mockUserRepository.save.mockResolvedValue(user);

        await service.create('Test User', 'Test Address');

        expect(mockUserRepository.create).toHaveBeenCalledWith({ name: 'Test User', wallet_address: 'Test Address' });
        expect(mockUserRepository.save).toHaveBeenCalledWith(user);
    });

    it('should return user coins', async () => {
        const userCoins = [{ id: 1, user: { id: 2 }, coin: { id: 1 } }];
        mockUserCoinRepository.find.mockReturnValue(userCoins);

        expect(await service.getHeldCoin(1)).toBe(userCoins);
        expect(mockUserCoinRepository.find).toHaveBeenCalledWith({ where: { user: { id: 1 } }, relations: ['coin'] });
    });

    it('should return created coins', async () => {
        const coins = [{ id: 1, creator: { id: 1 }, name: 'Test Coin', ticker: 'TST', description: 'Test Coin Description' }];
        mockCoinRepository.find.mockReturnValue(coins);

        expect(await service.getCreateCoin(1)).toBe(coins);
    });
});