import { RoleService } from '@/modules/user/services/role.service';
import { Role } from '@common/models/user/role.schema';
import { APP_MODULES } from '@configs/constants/constants';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

const mockRoleModel = {
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
};

describe('RoleService', () => {
  let service: RoleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleService,
        {
          provide: getModelToken(Role.name),
          useValue: mockRoleModel,
        },
      ],
    }).compile();

    service = module.get<RoleService>(RoleService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all roles', async () => {
      mockRoleModel.find.mockReturnValue({
        lean: jest.fn().mockResolvedValue(['role1', 'role2']),
      });
      const result = await service.findAll();
      expect(result.data).toEqual(['role1', 'role2']);
    });
  });

  describe('findByName', () => {
    it('should return a role by name', async () => {
      mockRoleModel.findOne.mockReturnValue({
        lean: jest.fn().mockResolvedValue('role1'),
      });
      const result = await service.findByName('admin');
      expect(result.data).toEqual('role1');
    });
  });

  describe('create', () => {
    it('should create a new role', async () => {
      mockRoleModel.create.mockResolvedValue({ name: 'new-role' });
      const result = await service.create({ name: 'new-role' });
      expect(result.message).toBe('Role created successfully');
    });
  });

  describe('findAllPermissions', () => {
    it('should return all permissions', async () => {
      const result = await service.findAllPermissions();
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('findAllPermissionsByModule', () => {
    it('should return permissions for a specific module', async () => {
      const result = await service.findAllPermissionsByModule(APP_MODULES.USER);
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return an empty array for an unknown module', async () => {
      const result = await service.findAllPermissionsByModule('unknown');
      expect(result).toEqual([]);
    });
  });
});
