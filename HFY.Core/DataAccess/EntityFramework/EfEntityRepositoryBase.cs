using HFY.Core.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;

namespace HFY.Core.DataAccess.EntityFramework
{
    public class EfEntityRepositoryBase<TEntity, TContext> : IEntityRepository<TEntity> 
        where TEntity : class, IEntity, new()
        where TContext : DbContext, new()
    {
        public TEntity Get(Expression<Func<TEntity, bool>> filter = null)
        {
            using (var context = new TContext())
            {
                return context.Set<TEntity>().FirstOrDefault(filter);
            }
        }

        public List<TEntity> GetList(Expression<Func<TEntity, bool>> filter = null,int take=0,int skip=0)
        {
            using (var context = new TContext())
            {
                if(filter == null)
                {
                    if(take == 0 && skip == 0)
                    {
                        return context.Set<TEntity>().ToList();
                    }
                    else if(take != 0 && skip == 0)
                    {
                        return context.Set<TEntity>().Take(take).ToList();
                    }
                    else if(take == 0 && skip != 0)
                    {
                        return context.Set<TEntity>().Skip(skip).ToList();
                    }
                    else if(take != 0 && skip != 0)
                    {
                        return context.Set<TEntity>().Skip(skip).Take(take).ToList();
                    }
                }
                else
                {
                    if (take == 0 && skip == 0)
                    {
                        return context.Set<TEntity>().Where(filter).ToList();
                    }
                    else if (take != 0 && skip == 0)
                    {
                        return context.Set<TEntity>().Where(filter).Take(take).ToList();
                    }
                    else if (take == 0 && skip != 0)
                    {
                        return context.Set<TEntity>().Where(filter).Skip(skip).ToList();
                    }
                    else if (take != 0 && skip != 0)
                    {
                        return context.Set<TEntity>().Where(filter).Skip(skip).Take(take).ToList();
                    }
                }
                return filter == null
                    ? context.Set<TEntity>().ToList()
                    : context.Set<TEntity>().Where(filter).ToList();
            }
        }

        public void Add(TEntity entity)
        {
            using (var context = new TContext())
            {
                var addedEntry = context.Entry(entity);
                addedEntry.State = EntityState.Added;
                context.SaveChanges();
            }
        }

        public void Update(TEntity entity)
        {
            using (var context = new TContext())
            {
                var updatedEntity = context.Entry(entity);
                updatedEntity.State = EntityState.Modified;
                context.SaveChanges();
            }
        }

        public void Delete(TEntity entity)
        {
            using (var context = new TContext())
            {
                var deletedEntry = context.Entry(entity);
                deletedEntry.State = EntityState.Deleted;
                context.SaveChanges();
            }
        }

    }
}
