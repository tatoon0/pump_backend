import { Test, TestingModule } from '@nestjs/testing';
import { CoinService } from './coin.service';
import exp from 'constants';

// Mock for CoinRepository
const mockCoinRepository = {
    createQueryBuilder: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
};

// Mock for CoinStatRepository
const mockCoinStatRepository = {
    find: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
};

// Mock for userRepository
const mockUserRepository = {
    findOne: jest.fn(),
};

// Mock for UserCoinRepository
const mockUserCoinRepository = {
    find: jest.fn(),
};

// Mock for tradeRepository
const mockTradeRepository = {
    find: jest.fn(),
};

describe('CoinService', () => {
    let service: CoinService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CoinService,
                { provide: 'CoinsRepository', useValue: mockCoinRepository },
                { provide: 'CoinStatRepository', useValue: mockCoinStatRepository },
                { provide: 'UserCoinRepository', useValue: mockUserCoinRepository },
                { provide: 'TradeRepository', useValue: mockTradeRepository },
                { provide: 'UsersRepository', useValue: mockUserRepository },
            ],
        }).compile();

        service = module.get<CoinService>(CoinService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    const coins = [
        { id: 1, created_at: new Date('2021-01-01'), coinStat: { last_trade_date: new Date('2021-02-01'), total_funded: 100 }},
        { id: 2, created_at: new Date('2021-01-02'), coinStat: { last_trade_date: new Date('2021-02-02'), total_funded: 200 }},
        { id: 3, created_at: new Date('2021-01-03'), coinStat: { last_trade_date: new Date('2021-02-03'), total_funded: 300 }},
    ];

    it('should return all coins sorted by created desc', async () => {
        const sortedCoins = [...coins].sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
        mockCoinRepository.getMany.mockResolvedValue(sortedCoins);

        const result = await service.findAll('created', 'desc');
        expect(result).toEqual(sortedCoins);
        expect(mockCoinRepository.createQueryBuilder).toHaveBeenCalledWith('coin');
        expect(mockCoinRepository.leftJoinAndSelect).toHaveBeenCalledWith('coin.coinStat', 'coinstat');
        expect(mockCoinRepository.orderBy).toHaveBeenCalledWith({ 'coin.created_at': 'desc' });
    });

    it('should return all coins sorted by created asc', async () => {
        const sortedCoins = [...coins].sort((a, b) => a.created_at.getTime() - b.created_at.getTime());
        mockCoinRepository.getMany.mockResolvedValue(sortedCoins);

        const result = await service.findAll('created', 'asc');
        expect(result).toEqual(sortedCoins);
        expect(mockCoinRepository.createQueryBuilder).toHaveBeenCalledWith('coin');
        expect(mockCoinRepository.leftJoinAndSelect).toHaveBeenCalledWith('coin.coinStat', 'coinstat');
        expect(mockCoinRepository.orderBy).toHaveBeenCalledWith({ 'coin.created_at': 'asc' });
    });

    it('should return all coins sorted by trade desc', async () => {
        const sortedCoins = [...coins].sort((a, b) => b.coinStat.last_trade_date.getTime() - a.coinStat.last_trade_date.getTime());
        mockCoinRepository.getMany.mockResolvedValue(sortedCoins);

        const result = await service.findAll('trade', 'desc');
        expect(result).toEqual(sortedCoins);
        expect(mockCoinRepository.createQueryBuilder).toHaveBeenCalledWith('coin');
        expect(mockCoinRepository.leftJoinAndSelect).toHaveBeenCalledWith('coin.coinStat', 'coinstat');
        expect(mockCoinRepository.orderBy).toHaveBeenCalledWith({ 'coinstat.last_trade_date': 'desc' });
    });

    it('should return all coins sorted by trade asc', async () => {
        const sortedCoins = [...coins].sort((a, b) => a.coinStat.last_trade_date.getTime() - b.coinStat.last_trade_date.getTime());
        mockCoinRepository.getMany.mockResolvedValue(sortedCoins);

        const result = await service.findAll('trade', 'asc');
        expect(result).toEqual(sortedCoins);
        expect(mockCoinRepository.createQueryBuilder).toHaveBeenCalledWith('coin');
        expect(mockCoinRepository.leftJoinAndSelect).toHaveBeenCalledWith('coin.coinStat', 'coinstat');
        expect(mockCoinRepository.orderBy).toHaveBeenCalledWith({ 'coinstat.last_trade_date': 'asc' });
    });

    it('should return all coins sorted by funded desc', async () => {
        const sortedCoins = [...coins].sort((a, b) => b.coinStat.total_funded - a.coinStat.total_funded);
        mockCoinRepository.getMany.mockResolvedValue(sortedCoins);

        const result = await service.findAll('funded', 'desc');
        expect(result).toEqual(sortedCoins);
        expect(mockCoinRepository.createQueryBuilder).toHaveBeenCalledWith('coin');
        expect(mockCoinRepository.leftJoinAndSelect).toHaveBeenCalledWith('coin.coinStat', 'coinstat');
        expect(mockCoinRepository.orderBy).toHaveBeenCalledWith({ 'coinstat.total_funded': 'desc' });
    });

    it('should return all coins sorted by funded asc', async () => {
        const sortedCoins = [...coins].sort((a, b) => a.coinStat.total_funded - b.coinStat.total_funded);
        mockCoinRepository.getMany.mockResolvedValue(sortedCoins);

        const result = await service.findAll('funded', 'asc');
        expect(result).toEqual(sortedCoins);
        expect(mockCoinRepository.createQueryBuilder).toHaveBeenCalledWith('coin');
        expect(mockCoinRepository.leftJoinAndSelect).toHaveBeenCalledWith('coin.coinStat', 'coinstat');
        expect(mockCoinRepository.orderBy).toHaveBeenCalledWith({ 'coinstat.total_funded': 'asc' });
    });

    it('should return a coin', async () => {
        const coin = coins[0];
        mockCoinRepository.findOne.mockResolvedValue(coin);

        const result = await service.findOne(1);
        expect(result).toEqual(coin);
        expect(mockCoinRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: ['coinStat'] });
    });

    it('should return holders', async () => {
        const holders = [{ id: 1, user: { id: 1 }, coin: { id: 1 } }];
        mockUserCoinRepository.find.mockResolvedValue(holders);

        const result = await service.getHolder(1);
        expect(result).toEqual(holders);
        expect(mockUserCoinRepository.find).toHaveBeenCalledWith({ where: { coin: { id: 1 } }, order: { amount: 'desc' }, relations: ['user'] });
    });

    it('should create a coin', async () => {
        const creator = { id: 1 };
        mockUserRepository.findOne.mockResolvedValue(creator);

        const coin = { id: 1, creator, name: 'Test Coin', ticker: 'TST', description: 'Test Coin Description' };
        mockCoinRepository.create.mockReturnValue(coin);
        mockCoinRepository.save.mockResolvedValue(coin);

        const coinstat = { id: 1, coin: { id: 1 } };
        mockCoinStatRepository.create.mockReturnValue(coinstat);
        mockCoinStatRepository.save.mockResolvedValue(coinstat);

        await service.create(1, 'Test Coin', 'TST', 'Test Coin Description');

        expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
        expect(mockCoinRepository.create).toHaveBeenCalledWith({ creator, name: 'Test Coin', ticker: 'TST', description: 'Test Coin Description' });
        expect(mockCoinRepository.save).toHaveBeenCalledWith(coin);
        expect(mockCoinStatRepository.create).toHaveBeenCalledWith({ coin });
        expect(mockCoinStatRepository.save).toHaveBeenCalledWith(coinstat);

        const finalcoin = { ...coin, coinStat: coinstat };
        expect(mockCoinRepository.save).toHaveBeenCalledWith(finalcoin);
    });

    it('should return trade history', async () => {
        const coinId = 1;
        const trades = [
            {
                id: 1,
                trade_date: new Date('2021-01-01'),
                coin: { id: 2 },
                user: { id: 1, name: 'User A' },
                amount: 100,
                price: 50,
            },
            {
                id: 2,
                trade_date: new Date('2021-01-02'),
                coin: { id: coinId },
                user: { id: 2, name: 'User B' },
                amount: 200,
                price: 60,
            },
        ]

        mockTradeRepository.find.mockResolvedValue(trades);

        const result = await service.getTradeHistory(coinId);
        expect(result).toEqual(trades);
        expect(mockTradeRepository.find).toHaveBeenCalledWith({ where: { coin: { id: 1 } }, order: { trade_date: 'DESC' }, relations: ['user']});
    });
});